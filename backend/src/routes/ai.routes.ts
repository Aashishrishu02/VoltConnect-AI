import { Router } from 'express';
import { processAIChatQuery, getSmartRecommendations } from '../controllers/ai.controller';

const router = Router();

router.post('/chat-query', processAIChatQuery);
router.post('/recommendations', getSmartRecommendations);

export default router;
