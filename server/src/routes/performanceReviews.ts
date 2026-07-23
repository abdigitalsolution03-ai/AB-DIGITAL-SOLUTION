import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getReviews, getReview, createReview, updateReview, deleteReview } from '../controllers/performanceReviewController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager', 'team_leader'), getReviews);
router.get('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), getReview);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createReview);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateReview);
router.delete('/:id', authorize('super_admin'), deleteReview);

export default router;
