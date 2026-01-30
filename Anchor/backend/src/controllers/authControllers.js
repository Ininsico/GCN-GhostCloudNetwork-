import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from "util";
import { sendEmail } from '../services/emailservice.js';
import { rateLimiter } from '../middleware/rateLimit.middleware.js';

const signToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            algorithm: 'HS256'
        }
    );
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10) * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict'
    };

    // Remove sensitive data from output
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

// Rate limits for auth endpoints
const loginRateLimiter = rateLimiter(5, 15); // 5 Attempts per 15 minutes

export const signup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email.toLowerCase() },
                { username: req.body.username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: existingUser.email === req.body.email.toLowerCase()
                    ? 'Email Already Exists'
                    : 'Username Already Taken'
            });
        }

        // create a new user
        const newUser = await User.create({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            ipAddress: req.ip
        });

        // create verification token
        const verificationToken = newUser.createVerificationToken();
        await newUser.save({ validateBeforeSave: false });

        // send verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;

        try {
            await sendEmail({
                email: newUser.email,
                subject: 'Verify your email',
                message: `Welcome to Anchor! Please verify your email by clicking: ${verificationUrl}`
                // template: 'emailverification',
                // context: { ... } 
            });

            createSendToken(newUser, 201, req, res);
        } catch (error) {
            // remove user if email fails
            await User.findByIdAndDelete(newUser._id);
            return next(new Error('Failed to send verification Email, Please try Again'));
        }
    } catch (error) {
        next(error);
    }
};

export const login = [
    loginRateLimiter,
    async (req, res, next) => {
        try {
            const { email, password, rememberMe } = req.body;

            // check if email and password exist
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide email and password'
                });
            }

            // find user
            const user = await User.findByEmail(email.toLowerCase());

            // check user and password
            if (!user || !(await user.correctPassword(password, user.password))) {
                // increment login attempts
                if (user) {
                    await user.incrementLoginAttempts();
                }
                return res.status(401).json({
                    status: 'error',
                    message: 'Incorrect email or password'
                });
            }

            // check if account is locked
            if (user.isLocked()) {
                return res.status(423).json({
                    status: 'error',
                    message: 'Account is temporarily locked due to too many failed attempts. Please try again later.'
                });
            }

            // check if email is verified
            if (!user.emailVerified) {
                return res.status(403).json({
                    status: 'error',
                    message: "Please verify your email before logging in."
                });
            }

            // check if account is active
            if (!user.isActive) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Your account has been deactivated. Please contact support.'
                });
            }

            // reset login attempts on successful login
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        loginAttempts: 0,
                        lastLogin: new Date(),
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }
            );

            // Set JWT Expiration based on RememberMe
            // Note: Changing process.env is bad practice as it affects global state. 
            // Better to pass logic to signToken, but keeping simple for now or using default.
            // if (rememberMe) { ... }

            createSendToken(user, 200, req, res);
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
    res.status(200).json({
        status: 'success',
        message: "Logged out successfully"
    });
};

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'The user belonging to this token no longer exists.'
            });
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: 'error',
                message: 'User recently changed password. Please log in again.'
            });
        }

        if (!currentUser.isActive) {
            return res.status(403).json({
                status: 'error',
                message: "Your account has been deactivated."
            });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid Token. Please log in again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Your token has expired! Please log in again.'
            });
        }
        next(error);
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

export const forgotpassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });

        if (!user) {
            return res.status(200).json({
                status: 'success',
                message: 'If an account exists, you will receive a password reset email.'
            });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Your password reset token (valid for 10 minutes)",
                message: `Click here to reset your password: ${resetUrl}`
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new Error('There was an error sending the email. Try again later.'));
        }
    } catch (error) {
        next(error);
    }
};

export const resetpassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: "Token is invalid or has expired"
            });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        createSendToken(user, 200, req, res);
    } catch (error) {
        next(error);
    }
};

export const updatepassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: "Your current password is wrong"
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        createSendToken(user, 200, req, res);
    } catch (error) {
        next(error);
    }
};

export const verifyemail = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: "Token is invalid or has expired"
            });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Email Verified Successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const resendverification = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                status: "error",
                message: "Email is already verified"
            });
        }

        if (user.verificationTokenExpires && user.verificationTokenExpires > Date.now()) {
            const timeLeft = Math.ceil((user.verificationTokenExpires - Date.now()) / 60000);
            return res.status(429).json({
                status: "error",
                message: `Please wait ${timeLeft} minutes before requesting another verification email`
            });
        }

        const verificationToken = user.createVerificationToken();
        await user.save({ validateBeforeSave: false });

        const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;

        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message: `Verify email: ${verificationUrl}`
        });

        res.status(200).json({
            status: "success",
            message: "Verification email sent"
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({
                status: 'error',
                message: "This route is not for password updates. Please use /updatepassword"
            });
        }

        const filteredBody = {};
        const allowedFields = ['username', 'email', 'firstName', 'lastName'];

        Object.keys(req.body).forEach(el => {
            if (allowedFields.includes(el)) {
                filteredBody[el] = req.body[el];
            }
        });

        if (req.body.email && req.body.email !== req.user.email) {
            filteredBody.emailVerified = false;
            // logic to send new verification email ...
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isActive: false });
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            results: users.length,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: 'No user found with that ID'
            });
        }
        res.status(200).json({
            status: "success",
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

export const deactiveuser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "No user found with that ID"
            });
        }
        res.status(200).json({
            status: "success",
            message: "User deactivated"
        });
    } catch (error) {
        next(error);
    }
};

export const activateuser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "No user found with that ID"
            });
        }
        res.status(200).json({
            status: "success",
            message: "User activated"
        });
    } catch (error) {
        next(error);
    }
};