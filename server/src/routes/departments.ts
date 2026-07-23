import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController';

const router = Router();

router.use(authenticate);
router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', authorize('super_admin', 'hr_manager'), createDepartment);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateDepartment);
router.delete('/:id', authorize('super_admin'), deleteDepartment);

export default router;
