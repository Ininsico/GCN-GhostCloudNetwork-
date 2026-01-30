import express from 'express';
import {
    signup,
    login,
    logout,
    protect,
    restrictTo,
    forgotpassword,
    resetpassword,
    updatepassword,
    verifyemail,
    resendverification,
    getMe,
    getAllUsers,
    deactiveuser,
    activateuser,
    deleteMe,
    updateMe,
    getUser
} from '../controllers/authControllers.js';
import { validateMiddleware, variables } from '../middleware/validation.middleware.js';
import { rateLimiter, loginlimiter, signuplimiter, passwordResetLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signuplimiter, validateMiddleware(variables.signup), signup);
router.post('/login', loginlimiter, validateMiddleware(variables.login), login);
router.post('/logout', logout);
router.post('/forgotpassword', passwordResetLimiter, validateMiddleware(variables.forgotpassword), forgotpassword);
router.post('/resetpassword/:token', validateMiddleware(variables.resetpassword), resetpassword);
router.post('/verifyemail/:token', verifyemail);
router.post('/resendverification', passwordResetLimiter, validateMiddleware(variables.resendverification), resendverification);

// Protected Routes (require Authentication)
router.use(protect); // All routes after this are protected

router.get('/me', getMe);
router.patch('/updateme', validateMiddleware(variables.updateMe), updateMe);
router.get('/deleteme', deleteMe);
router.patch('/updatepassword', validateMiddleware(variables.updatepassword), updatepassword);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/deactivate', deactiveuser);
router.patch('/:id/activate', activateuser);

export default router;
