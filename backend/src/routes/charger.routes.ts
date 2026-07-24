import { Router } from 'express';
import { searchChargers, getChargerById, createCharger, updateCharger, getHostChargers } from '../controllers/charger.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/search', searchChargers);
router.get('/host/my-chargers', authenticate, getHostChargers);
router.get('/:id', getChargerById);
router.post('/', authenticate, createCharger);
router.put('/:id', authenticate, updateCharger);

export default router;
