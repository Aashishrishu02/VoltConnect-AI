import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createReview);

export default router;
