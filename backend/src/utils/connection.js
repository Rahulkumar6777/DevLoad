import IORedis from 'ioredis';


export const connection = new IORedis({
    maxRetriesPerRequest: null,
    host: "redis",
    port: 6379,
});