import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export async function createPaymentIntent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, currency = 'usd', paymentMethod = 'STRIPE' } = req.body;

    if (!amount) {
      res.status(400).json({ error: 'Amount is required.' });
      return;
    }

    const clientSecret = `pi_mock_stripe_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    const razorpayOrderId = `order_rzp_${Date.now()}`;

    res.json({
      success: true,
      paymentMethod,
      clientSecret: paymentMethod === 'STRIPE' ? clientSecret : undefined,
      orderId: paymentMethod === 'RAZORPAY' ? razorpayOrderId : undefined,
      amount,
      currency,
    });
  } catch (err) {
    next(err);
  }
}

export async function applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, amount } = req.body as { code?: string; amount?: number };
    if (!code || !amount) {
      res.status(400).json({ error: 'Coupon code and amount are required.' });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive || coupon.validUntil < new Date()) {
      res.status(400).json({ error: 'Invalid or expired coupon code.' });
      return;
    }

    const discount = Math.min((amount * coupon.discountPercent) / 100, coupon.maxDiscount);
    const finalAmount = Math.max(0, amount - discount);

    res.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount: Math.round(discount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
    });
  } catch (err) {
    next(err);
  }
}
