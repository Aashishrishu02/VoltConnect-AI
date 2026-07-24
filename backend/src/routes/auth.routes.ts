import { Router } from 'express';
import { register, login, googleLogin, refreshToken, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getProfile);

export default router;
