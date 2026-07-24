import { Router } from 'express';
import { processAIChatQuery, getSmartRecommendations, planEVRoute } from '../controllers/ai.controller';

const router = Router();

router.post('/chat-query', processAIChatQuery);
router.post('/recommendations', getSmartRecommendations);
router.post('/route-plan', planEVRoute);

export default router;
