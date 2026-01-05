import Redis from "ioredis";

export const connection = new Redis("redis://redis:6379", {
  maxRetriesPerRequest: null,     
});

connection.on("ready", () => {
  console.log(" Redis READY (stable connection)");
});

connection.on("error", (err) => {
  console.error(" Redis error:", err.message);
});
