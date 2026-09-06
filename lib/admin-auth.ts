// Simple signed-cookie session for the demo admin gate.
//
// Uses Web Crypto (crypto.subtle) instead of Node's `crypto` module so the
// same code works in both the Edge runtime (middleware.ts) and the Node
// runtime (route handlers). No sessions table, no extra dependency —
// good enough for "keep randos out," not meant to be bank-grade auth.

export const ADMIN_COOKIE_NAME = "ahadu_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD env var is not set — required for the admin login gate."
    );
  }
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toHex(signature);
}

/** Builds a new signed session value to set as a cookie after a correct login. */
export async function createSessionValue(): Promise<string> {
  const expires = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

/** Verifies a cookie value: correct signature and not expired. */
export async function isValidSession(
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false;

  const dot = value.indexOf(".");
  if (dot === -1) return false;

  const payload = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expected = await hmac(payload);

  if (signature.length !== expected.length) return false;

  // Constant-time-ish comparison to avoid leaking the signature byte-by-byte.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const expires = Number(payload);
  if (!expires || Date.now() > expires) return false;

  return true;
}
