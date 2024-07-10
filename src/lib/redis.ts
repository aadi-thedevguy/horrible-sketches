import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { genericMessages } from "@/constants";

// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

// Create a new ratelimiter, that allows 10 requests per 10 seconds

export async function ratelimit(
  identifier: string,
  totalRequests: number = 10,
  timeWindow: number = 10
) {
  // timeWindow is in seconds
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(totalRequests, `${timeWindow} s`),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/horrible-sketches",
  });

  // Or use a userID, apiKey or ip address for individual limits.
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    throw new Error(genericMessages.RATELIMIT_EXCEEDED);
  }
}
