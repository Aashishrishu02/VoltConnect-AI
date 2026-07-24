import { Router } from 'express';
import { createPaymentIntent, applyCoupon } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/apply-coupon', applyCoupon);

export default router;
