import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getPayrolls, getPayroll, createPayroll, updatePayroll, deletePayroll, generatePayroll, getSalarySlips } from '../controllers/payrollController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager'), getPayrolls);
router.get('/salary-slips', getSalarySlips);
router.get('/:id', authorize('super_admin', 'hr_manager'), getPayroll);
router.post('/', authorize('super_admin', 'hr_manager'), createPayroll);
router.post('/generate', authorize('super_admin', 'hr_manager'), generatePayroll);
router.put('/:id', authorize('super_admin', 'hr_manager'), updatePayroll);
router.delete('/:id', authorize('super_admin'), deletePayroll);

export default router;
