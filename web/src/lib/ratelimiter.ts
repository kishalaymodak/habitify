import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

export const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // e.g. 3 requests per hour
  analytics: true,
  prefix: "project-a:forgot-password", // IMPORTANT: unique prefix per project
});
