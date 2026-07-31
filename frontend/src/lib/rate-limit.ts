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

// In-memory fallback for environments without Redis
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetAt,
  };
}

// Cleanup expired entries every 5 minutes (non-production only)
if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetAt) memoryStore.delete(key);
    }
  }, 5 * 60 * 1000);
}

let warnedAboutMissingRedis = false;

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 10 }
): Promise<RateLimitResult> {
  if (!ratelimit) {
    if (process.env.NODE_ENV === "production" && !warnedAboutMissingRedis) {
      warnedAboutMissingRedis = true;
      console.warn(
        "⚠️  [rate-limit] Redis not configured. Falling back to in-memory rate limiting. " +
        "This is NOT suitable for multi-instance deployments. " +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment."
      );
    }
    return checkMemoryRateLimit(key, config);
  }

  const { success, remaining, reset } = await ratelimit.limit(key);
  return { allowed: success, remaining, resetTime: reset };
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
