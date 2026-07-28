/**
 * ⚠️  NOTE: This rate limiter uses a global Map that works in Node.js runtime (self-hosted / Docker).
 * In Serverless environments (Vercel, AWS Lambda), each request gets a fresh instance,
 * so this Map resets on every cold start and rate limiting will NOT work correctly.
 *
 * ✅ For production on Vercel/serverless, replace this with Upstash Redis:
 *    npm install @upstash/ratelimit @upstash/redis
 *    https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Only used in Node.js / long-running server runtime
const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = { count: 1, resetTime: now + config.windowMs };
    rateLimitStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * اضافه کردن headers مرتبط به Rate Limit به Response
 * برای استفاده در API routes:
 *   const result = checkRateLimit(ip);
 *   const res = NextResponse.json(...);
 *   return applyRateLimitHeaders(res, result);
 */
export function applyRateLimitHeaders(
  response: Response,
  result: ReturnType<typeof checkRateLimit>,
  maxRequests = 10
): Response {
  const headers = new Headers(response.headers);
  headers.set("X-RateLimit-Limit", String(maxRequests));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));
  if (!result.allowed) {
    headers.set("Retry-After", String(Math.ceil((result.resetTime - Date.now()) / 1000)));
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Cleanup expired entries every 5 minutes - only safe in long-running Node.js process
if (typeof setInterval !== "undefined" && process.env.NEXT_RUNTIME !== "edge") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60_000);
}
