import { body, validationResult, params } from 'express-validator';
import User from '../models/UserModel';
const checkemailexsits = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !user;
};
const checkusernameexsits = async (username) => {
    const user = await User.findOne({ username: username.toLowerCase() });
};
const checkpasswordstrength = async (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
};
//validation rules
export const variables = {
    signup: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide an email")
            .custom(async email => {
                const exsits = await checkemailexsits(email);
                if (!exsits) throw new Error('Email is already in use');
                return true;
            }),
        body('username')
            .trim()
            .islength({ min: 3, max: 30 })
            .withMessage("Username must be between 3-30 characters")
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage("Username can only contain letters,numbers and underscores")
            .custom(async username => {
                const exsits = await checkusernameexsits(username);
                if (!exsits) throw new Error("Username is already taken");
                return true;
            }),
        body('password')
            .islength({ min: 8 })
            .withMessage("Password must be atleast 6 characters long")
            .custom(async password => {
                if (!checkpasswordstrength(password)) {
                    throw new Error('password must contain at least one uppercase & Other relative security protocols')
                }
                return true;
            }),
        body('confirmpassword')
            .custom((value, { req }) => {
                if (value != req.body.password) {
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
            .withMessage("Please provide an valid email"),

        body('password')
            .notempty()
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
        params('token')
            .notempty()
            .withMessage("Token is required"),
        body('password')
            .islength({ min: 8 })
            .withMessage("password must be atleast 8 characters long")
            .custom(password => {
                if (!checkpasswordstrength(password)) {
                    throw new Error('Password must contain atleast 8 characters')
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
            .notempty()
            .withMessage('Current Password is required'),

        body('newPassword')
            .islength({ min: 6 })
            .withMessage("New password must be 6 characters long")
            .custom((newPassword, { req }) => {
                if (!checkpasswordstrength(newPassword)) {
                    throw new Error('Password must be valid')
                }
                if (newPassword === req.body.currentPassword) {
                    throw new Error('New password must be different from last password')
                }
                return true;
            }),
        body('confirmpassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error("Homie boye are u high on something,can u even write 2 words same?")
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
            .withMessage("Please homie boye please leave me alone"),
        body('username')
            .optional()
            .trim()
            .islength({ min: 3, max: 30 })
            .withMessage("Username must be between 3-30 characters")
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage("Username can only contain LETTERS,NUMBERS AND UNDERSCORES"),
        body("firstName")
            .optional()
            .trim()
            .islength({ min: 2, max: 50 })
            .withMessage('First name can only be between 2-50 characters'),
        body("lastName")
            .optional()
            .trim()
            .islength({ min: 3, max: 50 })
            .withMessage('last name must be between 2-50 charas')
    ],
    resendverfication: [
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please provide a valid email")
    ]
};

//Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formmatederrors = errors.array().map(err => ({
            feild: err.path,
            message: err.message
        }));
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formmatederrors
        });
    }
    next();
}
//Apply validation middleware to routes
export const validateMiddleware = (validateRules) => {
    return [
        ...validateRules,
        handleValidationErrors
    ];
}