import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const redis = createRedis();

function makeLimiter(prefix: string, config: Parameters<typeof Ratelimit.slidingWindow>): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(...config), prefix });
}

export const checkoutLimiter      = makeLimiter("rl:checkout",       [3,  "1 m"]);
export const couponLimiter        = makeLimiter("rl:coupon",         [10, "1 m"]);
export const trackLimiter         = makeLimiter("rl:track",          [5,  "1 m"]);
export const shippingQuoteLimiter = makeLimiter("rl:shipping-quote", [10, "1 m"]);
export const searchLimiter        = makeLimiter("rl:search",         [30, "1 m"]);
