import rateLimit from 'express-rate-limiter'
import RedisStore from 'rate-limit-redis'
import { redisClient } from '../config/redis'

export const rateLimiter = (maxReqeusts, windowMinutes) => {
    const windowMs = windowMinutes * 60 * 1000;
    return rateLimit({
        windowMs: windowMinutes,
        max: maxReqeusts,
        message: {
            status: "error",
            message: `Too many requests from this IP,please try again in ${windowMinutes} minutes`
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        keyGenerator: (req) => {
            return req.ip
        },
        //store in redis for distributed systems
        store: redisClient ? new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args)
        }) : undefined,
        handler: (req, res) => {
            res.status(429).json({
                status: 'error',
                message: `Too many requests.Please try again again after ${windowMinutes} minutes`
            });
        }
    });
}

//specific Rate limiters for different endpoints
export const loginlimiter = rateLimit(5, 15) //5 attempts per 15 minutes
export const signuplimiter = rateLimit(3, 60); //3 signups per hour
export const passwordResetLimiter = rateLimit(3, 60) //3passwordresetasks per hour
export const apilimiter = rateLimit(100, 15)//100 requests per 15 minutes for general API
export const strictlimiter = rateLimit(10, 1) //10 requests per 1 minute for senstitive endpoints

//Dynamic ratelimit based upon user role
export const dynamicRateLimiter = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
        //Admin get higher limits
        return rateLimiter(1000, 15)(req, res, next);
    } else if (user) {
        //Regular users
        return rateLimiter(100, 15)(req, res, next);
    } else {
        //Unauthenicated Users
        return rateLimiter(50, 15)(req, res, next);
    }
};
//Rate limit for brute force protection
export const bruteforcelimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: 'error',
        message: 'Too many failed attempts.Please try again after 15 minutes'
    },
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        //use ip for email for login attempts
        return `${req.ip}:${req.body.email || 'unknown'}`;
    }
})