import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createSessionValue,
} from "@/lib/admin-auth";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

// Hash both sides first so the buffers are always the same length —
// timingSafeEqual throws on length mismatch, and comparing raw lengths
// would leak the password length.
function passwordsMatch(supplied: string, expected: string): boolean {
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return NextResponse.json(
      {
        error:
          "Admin login isn't configured yet (ADMIN_PASSWORD and SESSION_SECRET must be set).",
      },
      { status: 500 }
    );
  }

  // 8 attempts per 15 minutes per IP. Counts every attempt, not just failures.
  if (isRateLimited(`login:${getClientIp(req)}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts — please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const password =
    body && typeof body.password === "string" ? body.password : "";

  if (!passwordsMatch(password, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const session = await createSessionValue();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
