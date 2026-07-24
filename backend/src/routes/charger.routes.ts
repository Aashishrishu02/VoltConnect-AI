import { Router } from 'express';
import { searchChargers, getChargerById, createCharger, updateCharger, getOwnerChargers } from '../controllers/charger.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/search', searchChargers);
router.get('/host/my-chargers', authenticate, getOwnerChargers);
router.get('/:id', getChargerById);
router.post('/', authenticate, createCharger);
router.put('/:id', authenticate, updateCharger);

export default router;
