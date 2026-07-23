import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { register, login, forgotPassword, resetPassword, getMe, updateProfile, changePassword } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
