import IORedis from 'ioredis';


export const connection = new IORedis({
    maxRetriesPerRequest: null,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});