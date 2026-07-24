import { Router } from 'express';
import { createBooking, getUserBookings, checkInBooking, checkOutBooking, cancelBooking, downloadInvoice } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getUserBookings);
router.post('/:id/check-in', authenticate, checkInBooking);
router.post('/:id/check-out', authenticate, checkOutBooking);
router.post('/:id/cancel', authenticate, cancelBooking);
router.get('/:id/invoice', authenticate, downloadInvoice);

export default router;
