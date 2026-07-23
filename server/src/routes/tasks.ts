import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskOrder } from '../controllers/taskController';

const router = Router();

router.use(authenticate);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createTask);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateTask);
router.delete('/:id', authorize('super_admin'), deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:id/order', authorize('super_admin', 'hr_manager', 'team_leader'), updateTaskOrder);

export default router;
