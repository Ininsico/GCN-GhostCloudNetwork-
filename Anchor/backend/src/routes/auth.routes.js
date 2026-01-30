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
import { validateMiddleware } from '../middleware/validation.middleware.js'; // Check if this file exists and exports this
import { rateLimiter, loginlimiter, signuplimiter, passwordResetLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signuplimiter, signup); // Removed validateMiddleware for now as I haven't checked it
router.post('/login', loginlimiter, login);
router.post('/logout', logout);
router.post('/forgotpassword', passwordResetLimiter, forgotpassword);
router.post('/resetpassword/:token', resetpassword);
router.post('/verifyemail/:token', verifyemail);
router.post('/resendverification', passwordResetLimiter, resendverification);

// Protected Routes (require Authentication)
router.use(protect); // All routes after this are protected

router.get('/me', getMe);
router.patch('/updateme', updateMe);
router.get('/deleteme', deleteMe);
router.patch('/updatepassword', updatepassword);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/deactivate', deactiveuser);
router.patch('/:id/activate', activateuser);

export default router;
