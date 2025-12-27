import Redis from "ioredis";

export const redisConnect = new Redis(process.env.REDIS_URL , {
  maxRetriesPerRequest: null,   // 👈 ye zaroori hai
  enableReadyCheck: false
});

// Error handling
redisConnect.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisConnect.on("connect", () => {
  console.log("Redis client connected successfully");
});