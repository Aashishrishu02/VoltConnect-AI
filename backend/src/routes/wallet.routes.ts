import { Router } from 'express';
import { getWallet, topUpWallet, withdrawWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getWallet);
router.post('/top-up', authenticate, topUpWallet);
router.post('/withdraw', authenticate, withdrawWallet);

export default router;
