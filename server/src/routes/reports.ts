import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import * as reportController from '../controllers/reportController';

const router = Router();

router.use(authenticate);
router.use(authorize('super_admin', 'hr_manager', 'team_leader'));
router.get('/attendance', reportController.getAttendanceReport);
router.get('/sales', reportController.getSalesReport);
router.get('/leads', reportController.getLeadsReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/projects', reportController.getProjectsReport);
router.get('/performance', reportController.getPerformanceReport);
router.get('/payroll', reportController.getPayrollReport);
router.get('/employees', reportController.getEmployeesReport);

export default router;
