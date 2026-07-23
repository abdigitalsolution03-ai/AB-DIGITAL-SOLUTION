import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getMilestones, getMilestone, createMilestone, updateMilestone, deleteMilestone } from '../controllers/milestoneController';

const router = Router();

router.use(authenticate);
router.get('/', getMilestones);
router.get('/:id', getMilestone);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createMilestone);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateMilestone);
router.delete('/:id', authorize('super_admin'), deleteMilestone);

export default router;
