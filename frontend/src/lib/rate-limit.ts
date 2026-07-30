import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
    })
  : null;

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 10 }
): Promise<RateLimitResult> {
  if (!ratelimit) {
    const resetTime = Date.now() + config.windowMs;
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  const { success, remaining, reset } = await ratelimit.limit(key);
  return {
    allowed: success,
    remaining,
    resetTime: reset,
  };
}

export function getClientIP(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }
  return "unknown";
}

export function applyRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
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
