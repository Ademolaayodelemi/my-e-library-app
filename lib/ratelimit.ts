import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

const ratelimit = new Ratelimit({
  redis, //instead of redis: redis,
  // Create a new ratelimiter, that allows 6 requests per 10 seconds per every single user
  limiter: Ratelimit.fixedWindow(6, "1m"), //there is also another option of "Ratelimit.slidingWindow(10, "10 s")". hover on it for info,
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;