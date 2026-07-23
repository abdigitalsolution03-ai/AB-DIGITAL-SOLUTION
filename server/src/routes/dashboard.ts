import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getStats, getRecentActivity, getUpcomingTasks } from '../controllers/dashboardController';

const router = Router();

router.use(authenticate);
router.get('/stats', getStats);
router.get('/recent-activity', getRecentActivity);
router.get('/upcoming-tasks', getUpcomingTasks);

export default router;
