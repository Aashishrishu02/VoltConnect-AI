import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import {
  getAdminStats,
  getPendingApprovals,
  approveChargerAdmin,
  rejectChargerAdmin,
  requestMoreInfoAdmin,
  suspendChargerAdmin,
  deleteChargerAdmin,
  getAdminAuditLogs,
  getAllUsersAdmin,
  promoteUserToAdmin,
} from '../controllers/admin.controller';

const router = Router();

// Strict Admin RBAC Protection
router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/approvals', getPendingApprovals);
router.get('/users', getAllUsersAdmin);
router.put('/users/:userId/promote-admin', promoteUserToAdmin);
router.put('/chargers/:id/approve', approveChargerAdmin);
router.put('/chargers/:id/reject', rejectChargerAdmin);
router.put('/chargers/:id/request-info', requestMoreInfoAdmin);
router.put('/chargers/:id/suspend', suspendChargerAdmin);
router.delete('/chargers/:id', deleteChargerAdmin);
router.get('/audit-logs', getAdminAuditLogs);

export default router;
