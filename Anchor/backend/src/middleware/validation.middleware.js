import { body, validationResult, param } from 'express-validator';
import User from '../models/UserModel.js';

const checkemailexsits = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
};

const checkusernameexsits = async (username) => {
    const user = await User.findOne({ username: username.toLowerCase() });
    return !!user;
};

const checkpasswordstrength = (password) => {
    // At least one lowercase, one uppercase, one number, one special character, 8+ chars
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
};

// Validation rules
export const variables = {
    signup: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email")
            .custom(async email => {
                const exists = await checkemailexsits(email);
                if (exists) throw new Error('Email is already in use');
                return true;
            }),
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage("Username must be between 3-30 characters")
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage("Username can only contain letters, numbers and underscores")
            .custom(async username => {
                const exists = await checkusernameexsits(username);
                if (exists) throw new Error("Username is already taken");
                return true;
            }),
        body('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .custom(password => {
                if (!checkpasswordstrength(password)) {
                    throw new Error('Password must contain at least one uppercase, lowercase, number and special character')
                }
                return true;
            }),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match')
                }
                return true;
            })
    ],
    login: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email"),

        body('password')
            .notEmpty()
            .withMessage("Password is required")
    ],
    forgotpassword: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email")
    ],
    resetpassword: [
        param('token')
            .notEmpty()
            .withMessage("Token is required"),
        body('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .custom(password => {
                if (!checkpasswordstrength(password)) {
                    throw new Error('Password must contain at least one uppercase, lowercase, number and special character')
                }
                return true;
            }),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match')
                }
                return true;
            })
    ],
    updatepassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current Password is required'),

        body('newPassword')
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters long")
            .custom((newPassword, { req }) => {
                if (!checkpasswordstrength(newPassword)) {
                    throw new Error('Password must contain at least one uppercase, lowercase, number and special character')
                }
                if (newPassword === req.body.currentPassword) {
                    throw new Error('New password must be different from the old password')
                }
                return true;
            }),
        body('confirmPassword') // Fixed casing for consistency
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error("Passwords do not match")
                }
                return true;
            })
    ],
    updateMe: [
        body('email')
            .optional()
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email"),
        body('username')
            .optional()
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage("Username must be between 3-30 characters")
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage("Username can only contain letters, numbers and underscores"),
        body("firstName")
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2-50 characters'),
        body("lastName")
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2-50 characters')
    ],
    resendverification: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email")
    ]
};

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg
        }));
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
}

// Apply validation middleware to routes
export const validateMiddleware = (validateRules) => {
    return [
        ...validateRules,
        handleValidationErrors
    ];
}