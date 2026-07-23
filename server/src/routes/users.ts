import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getUsers, getUser, createUser, updateUser, deleteUser, getUsersByRole } from '../controllers/userController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager'), getUsers);
router.get('/role/:role', authorize('super_admin', 'hr_manager'), getUsersByRole);
router.get('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), getUser);
router.post('/', authorize('super_admin', 'hr_manager'), createUser);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateUser);
router.delete('/:id', authorize('super_admin'), deleteUser);

export default router;
