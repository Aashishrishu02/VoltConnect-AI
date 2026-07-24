import { Router } from 'express';
import authRoutes from './auth.routes';
import chargerRoutes from './charger.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';
import walletRoutes from './wallet.routes';
import reviewRoutes from './review.routes';
import aiRoutes from './ai.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chargers', chargerRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/wallet', walletRoutes);
router.use('/reviews', reviewRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;
