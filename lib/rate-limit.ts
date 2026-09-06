// Basic in-memory rate limiter — enough to blunt casual form spam/bots on a
// demo site. NOT a real production rate limiter: this Map lives inside a
// single serverless function instance, so it resets on cold start and isn't
// shared across concurrent instances or regions. If this ever becomes a
// real restaurant's site, swap this for Upstash Redis (or Vercel KV) with
// the same `isRateLimited` signature.

const hits = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(
  key: string,
  limit = 3,
  windowMs = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
