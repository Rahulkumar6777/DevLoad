import Redis from "ioredis";

export const redisConnect = new Redis({
  host: "redis", 
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Error handling
redisConnect.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisConnect.on("connect", () => {
  console.log("Redis client connected successfully");
});