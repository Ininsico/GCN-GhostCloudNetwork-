import User from "../models/UserModel";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from "util";
import { sendEmail } from '../services/emailservice.js';
import { redisClient } from '../config/redis.js';
import { ratelimiter } from '../middleware/ratelimitermiddleware.js'

const signtoken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPRIES,
            algorithm: 'HS256'
        }
    );
};

const Sendtoken = (user, statuscode, req, res) => {
    const token = signtoken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'http',
        sameSite: 'strict'
    };
    //remove password from output
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(statuscode).json({
        status: 'success',
        token,
        data: { user }
    });
};
//Rate limits for authendpoints
const loginRateLimiter = ratelimiter(5, 15); //5 Attempts per 15 minutes
export const signup = async (req, res, next) => {
    try {
        const exsistingUser = await User.findOne({
            $or: [
                { email: req.body.email.toLowerCase() },
                { username: req.body.username.toLowerCase() }
            ]
        });
        if (exsistingUser) {
            return res.status(409).json({
                status: "error",
                message: exsistingUser.email === req.body.email.toLowerCase()
                    ? 'Email Already Exsits'
                    : 'Username Already Taken'
            });
        }
        //create a new user
        const newUser = await User.create({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            ipAddress: req.ip
        });
        //create verification token
        const verificationtoken = newUser.verificationtoken();
        await newUser.save({ validateBeforeSave: false });
        //send verification email
        const verificationurl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationtoken}`;
        try {
            await sendEmail({
                emial: newUser.email,
                subject: 'Verify your email',
                template: 'emailverification',
                context: {
                    name: newUser.username,
                    verificationurl,
                    year: new Date().getFullYear()
                }
            });
            createSendToken(newUser, 201, req, res);
        } catch (error) {
            //remove user if email fails
            await User.findByIdAndDelete(newUser._id);
            return next(new Error('Failed to send verification Email,Please try Again'));
        }
    } catch (error) {
        next(error);
    }
};

export const login = [
    loginRateLimiter,
    async (req, res, next) => {
        try {
            const { email, password, remeberMe } = req.body;
            //check if email and password exsit for the respective user first
            if (!email || !password) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Please provide correct credentials'
                });
            }
            //check if userexsists and password is correct
            const user = await User.findByEmail(email.toLowerCase());
            if (!user || !(await user.correctPassword(password, user.password))) {
                //increment login attempts to lock the acc in case its a attack
                if (user) {
                    await user.incrementLoginAttempts();
                }
                return res.status(409).json({
                    status: 'error',
                    message: 'Incorrect email or password'
                })
            }
            //check if the acc is locked
            if (user.islocked()) {
                return res.status(423).json({
                    status: 'error',
                    message: 'Account is temporary on lock due to too many Failed Attempts.Please try Again later'
                });
            }
            //check if user is verified
            if (!user.emailVerified) {
                return res.status(403).json({
                    status: 'error',
                    message: "Please verify your email before you login In"
                });
            }
            //check if account is active
            if (!user.isActive) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Your Account has been deActived.Please Contact Support'
                });
            }
            //reset login attempts on successfull login
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        loginAttempt: 0,
                        lastlogin: new Date(),
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }
            );
            //Set JWT Expiration based on RemeberME
            if (remeberMe) {
                process.env.JWT_EXPRIES = '30d';
            } else {
                proccess.env.JWT_EXPRIES = '7d';
            }
            //if everythin gucci send token to client
            createsendToken(user, 200, req, res);
        } catch (error) {
            next(error);
        }
    }
];

export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    //clear Session from Redis if using Session Store
    if (req.session) {
        req.session.destroy();
    }
    res.status(200).json({
        status: 'success',
        message: "logged out successfully"
    });
};

export const protect = async (req,res,next)=>{
    try{
        let token;
        
    }
}