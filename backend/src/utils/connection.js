import Redis from "ioredis";

export const connection = new Redis("redis://redis:6379", {
  maxRetriesPerRequest: 5,     
  retryStrategy(times) {
    if (times > 10) return null;
    return Math.min(times * 500, 3000);
  },
});

connection.on("ready", () => {
  console.log(" Redis READY (stable connection)");
});

connection.on("error", (err) => {
  console.error(" Redis error:", err.message);
});
