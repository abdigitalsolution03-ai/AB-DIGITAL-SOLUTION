import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

router.use(authenticate);
router.use(authorize('super_admin', 'hr_manager', 'team_leader'));
router.get('/sales-chart', analyticsController.getSalesChart);
router.get('/lead-funnel', analyticsController.getLeadFunnel);
router.get('/revenue-graph', analyticsController.getRevenueGraph);
router.get('/attendance-trends', analyticsController.getAttendanceTrends);
router.get('/productivity', analyticsController.getProductivity);
router.get('/task-completion', analyticsController.getTaskCompletion);
router.get('/monthly-growth', analyticsController.getMonthlyGrowth);

export default router;
