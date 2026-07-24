import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ error: 'BookingId, rating, and comment are required.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Only the driver who booked can review this charger.' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'You can only review a completed charging session.' });
    }

    if (booking.review) {
      return res.status(400).json({ error: 'You have already submitted a review for this booking.' });
    }

    const review = await prisma.review.create({
      data: {
        userId: userId!,
        chargerId: booking.chargerId,
        bookingId,
        rating: parseInt(rating, 10),
        comment,
      },
    });

    // Update Charger Average Rating
    const allReviews = await prisma.review.findMany({ where: { chargerId: booking.chargerId } });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await prisma.charger.update({
      where: { id: booking.chargerId },
      data: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}
