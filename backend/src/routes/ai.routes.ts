import { Router } from 'express';
import { getAIRecommendations, getDynamicPricing, planEVRoute, checkFraud } from '../controllers/ai.controller';

const router = Router();

router.post('/recommend', getAIRecommendations);
router.get('/pricing/:chargerId', getDynamicPricing);
router.post('/route-plan', planEVRoute);
router.post('/fraud-check', checkFraud);

export default router;
