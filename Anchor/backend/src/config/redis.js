import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    return {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
    };
};

export const redisClient = new Redis(getRedisUrl());

redisClient.on('connect', () => {
    console.log('Redis Connected Successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis Connection Error:', err);
});
