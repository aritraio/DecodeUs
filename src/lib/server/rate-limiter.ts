/**
 * In-memory sliding-window rate limiter (per-IP).
 * /api/analyze: max 5 requests per IP per hour.
 * /api/chat:    max 60 requests per IP per hour.
 */

interface WindowEntry {
  timestamps: number[];
}

const stores = new Map<string, WindowEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  let entry = stores.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    stores.set(key, entry);
  }
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    return { allowed: false, remaining: 0, resetAfterMs: windowMs - (now - oldest) };
  }
  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetAfterMs: windowMs,
  };
}

/** Test/SSR helper — reset all windows. */
export function resetRateLimits(): void {
  stores.clear();
}

export const ANALYZE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
export const CHAT_LIMIT = { max: 60, windowMs: 60 * 60 * 1000 };

/** Extract client IP from Next.js headers (x-forwarded-for aware). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
