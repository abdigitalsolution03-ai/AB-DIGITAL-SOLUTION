import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getEmployeeDirectory, getEmployeeTimeline } from '../controllers/employeeController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager', 'team_leader'), getEmployees);
router.get('/directory', authorize('super_admin', 'hr_manager', 'team_leader', 'employee'), getEmployeeDirectory);
router.get('/:id/timeline', authorize('super_admin', 'hr_manager'), getEmployeeTimeline);
router.get('/:id', authorize('super_admin', 'hr_manager', 'team_leader', 'employee'), getEmployee);
router.post('/', authorize('super_admin', 'hr_manager'), createEmployee);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateEmployee);
router.delete('/:id', authorize('super_admin'), deleteEmployee);

export default router;
