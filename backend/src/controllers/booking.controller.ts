import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { emitChargerUpdate, emitUserNotification } from '../services/socket.service';

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { chargerId, startTime, endTime, paymentMethod = 'WALLET', couponCode } = req.body;

    if (!chargerId || !startTime || !endTime) {
      return res.status(400).json({ error: 'ChargerId, startTime, and endTime are required.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end || start < new Date()) {
      return res.status(400).json({ error: 'Invalid booking duration or start time in the past.' });
    }

    const charger = await prisma.charger.findUnique({ where: { id: chargerId } });
    if (!charger) return res.status(404).json({ error: 'Charger not found.' });

    if (!charger.isAvailable) {
      return res.status(400).json({ error: 'Charger is currently offline or unavailable.' });
    }

    // Check for conflicting active bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        chargerId,
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        OR: [
          { startTime: { lte: start }, endTime: { gt: start } },
          { startTime: { lt: end }, endTime: { gte: end } },
          { startTime: { gte: start }, endTime: { lte: end } },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'Selected time slot conflicts with an existing booking.' });
    }

    // Calculate duration & price
    const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    let totalPrice = Math.round(totalHours * charger.pricePerHour * 100) / 100;

    // Apply Coupon if valid
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && coupon.validUntil > new Date()) {
        const discountAmount = Math.min((totalPrice * coupon.discountPercent) / 100, coupon.maxDiscount);
        totalPrice = Math.max(1, totalPrice - discountAmount);
      }
    }

    const qrCode = `CS-QR-${charger.id.slice(0, 6)}-${userId?.slice(0, 6)}-${Date.now()}`;

    // Process Wallet Payment if selected
    if (paymentMethod === 'WALLET') {
      const wallet = await prisma.wallet.findUnique({ where: { userId: userId! } });
      if (!wallet || wallet.balance < totalPrice) {
        return res.status(400).json({ error: 'Insufficient wallet balance. Please top up your wallet or select Stripe.' });
      }

      // Deduct from driver wallet
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: totalPrice } },
      });

      // Log wallet transaction
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'PAYMENT',
          amount: totalPrice,
          description: `Paid for charging at ${charger.title}`,
        },
      });

      // Credit host wallet (90% revenue share, 10% platform fee)
      const hostEarnings = Math.round(totalPrice * 0.9 * 100) / 100;
      const hostWallet = await prisma.wallet.findUnique({ where: { userId: charger.hostId } });
      if (hostWallet) {
        await prisma.wallet.update({
          where: { id: hostWallet.id },
          data: { balance: { increment: hostEarnings } },
        });
        await prisma.transaction.create({
          data: {
            walletId: hostWallet.id,
            type: 'EARNING',
            amount: hostEarnings,
            description: `Earnings from booking at ${charger.title}`,
          },
        });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId: userId!,
        chargerId,
        startTime: start,
        endTime: end,
        totalHours,
        totalPrice,
        status: 'CONFIRMED',
        qrCode,
        payment: {
          create: {
            userId: userId!,
            amount: totalPrice,
            currency: 'USD',
            status: 'PAID',
            paymentMethod: paymentMethod as any,
            transactionId: `txn_auto_${Date.now()}`,
          },
        },
      },
      include: { charger: true, payment: true },
    });

    // Notify Host via WebSocket & DB Notification
    await prisma.notification.create({
      data: {
        userId: charger.hostId,
        title: 'New Booking Confirmed! ⚡',
        message: `Driver booked ${totalHours.toFixed(1)} hours at ${charger.title}`,
        type: 'BOOKING',
      },
    });

    emitChargerUpdate(chargerId, { isAvailable: false, activeBookingId: booking.id });
    emitUserNotification(charger.hostId, { title: 'New Booking', message: `New booking at ${charger.title}` });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function getUserBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        charger: {
          select: { title: true, address: true, city: true, images: true, powerKw: true, connectorType: true },
        },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function checkInBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { qrCode } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id }, include: { charger: true } });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    if (qrCode && booking.qrCode !== qrCode) {
      return res.status(400).json({ error: 'Invalid QR Code for this booking.' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'IN_PROGRESS', checkInTime: new Date() },
    });

    emitChargerUpdate(booking.chargerId, { status: 'IN_PROGRESS' });

    res.json({ message: 'Check-in successful! Charging session started.', booking: updated });
  } catch (err) {
    next(err);
  }
}

export async function checkOutBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED', checkOutTime: new Date() },
    });

    emitChargerUpdate(booking.chargerId, { isAvailable: true, status: 'AVAILABLE' });

    res.json({ message: 'Check-out completed! Charging session ended successfully.', booking: updated });
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true, charger: true },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to cancel this booking.' });
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return res.status(400).json({ error: `Cannot cancel a booking with status ${booking.status}.` });
    }

    // Process Refund to Wallet
    const wallet = await prisma.wallet.findUnique({ where: { userId: booking.userId } });
    if (wallet && booking.payment && booking.payment.status === 'PAID') {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: booking.totalPrice } },
      });
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'REFUND',
          amount: booking.totalPrice,
          description: `Refund for cancelled booking at ${booking.charger.title}`,
        },
      });
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'REFUNDED' },
      });
    }

    const cancelled = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    emitChargerUpdate(booking.chargerId, { isAvailable: true });

    res.json({ message: 'Booking cancelled and 100% amount refunded to wallet.', booking: cancelled });
  } catch (err) {
    next(err);
  }
}

export async function downloadInvoice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, charger: true, payment: true },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    const pdfBuffer = await generateInvoicePDF({
      bookingId: booking.id,
      userName: booking.user.name,
      userEmail: booking.user.email,
      chargerTitle: booking.charger.title,
      chargerAddress: `${booking.charger.address}, ${booking.charger.city}`,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalHours: booking.totalHours,
      totalPrice: booking.totalPrice,
      paymentMethod: booking.payment?.paymentMethod || 'WALLET',
      status: booking.status,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${booking.id.slice(0, 8)}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
