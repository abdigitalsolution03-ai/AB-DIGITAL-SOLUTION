import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getLeaves, getLeave, createLeave, updateLeave, deleteLeave, approveLeave, rejectLeave } from '../controllers/leaveController';

const router = Router();

router.use(authenticate);
router.get('/', getLeaves);
router.get('/:id', getLeave);
router.post('/', createLeave);
router.put('/:id', updateLeave);
router.delete('/:id', authorize('super_admin', 'hr_manager'), deleteLeave);
router.post('/:id/approve', authorize('super_admin', 'hr_manager', 'team_leader'), approveLeave);
router.post('/:id/reject', authorize('super_admin', 'hr_manager', 'team_leader'), rejectLeave);

export default router;
