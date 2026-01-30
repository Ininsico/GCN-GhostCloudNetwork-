import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

export const rateLimiter = (maxRequests, windowMinutes) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        message: {
            status: "error",
            message: `Too many requests from this IP, please try again in ${windowMinutes} minutes`
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        keyGenerator: (req) => {
            return req.ip;
        },
        // Store in redis for distributed systems
        store: redisClient ? new RedisStore({
            sendCommand: (...args) => redisClient.call(...args)
        }) : undefined,
        handler: (req, res, next, options) => {
            res.status(429).json({
                status: 'error',
                message: options.message.message || options.message
            });
        }
    });
};

// Specific Rate limiters for different endpoints
export const loginlimiter = rateLimiter(5, 15); // 5 attempts per 15 minutes
export const signuplimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { status: 'error', message: 'Too many accounts created from this IP, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});
export const passwordResetLimiter = rateLimiter(3, 60); // 3 password reset asks per hour
export const apilimiter = rateLimiter(100, 15); // 100 requests per 15 minutes for general API
export const strictlimiter = rateLimiter(10, 1); // 10 requests per 1 minute for sensitive endpoints

// Dynamic ratelimit based upon user role
export const dynamicRateLimiter = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
        // Admin get higher limits
        return rateLimiter(1000, 15)(req, res, next);
    } else if (user) {
        // Regular users
        return rateLimiter(100, 15)(req, res, next);
    } else {
        // Unauthenticated Users
        return rateLimiter(50, 15)(req, res, next);
    }
};

// Rate limit for brute force protection
export const bruteforcelimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: 'error',
        message: 'Too many failed attempts. Please try again after 15 minutes'
    },
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        // Use ip + email for login attempts to prevent brute force on specific accounts
        return `${req.ip}:${req.body.email || 'unknown'}`;
    }
});