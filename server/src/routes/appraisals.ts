import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getAppraisals, getAppraisal, createAppraisal, updateAppraisal, deleteAppraisal } from '../controllers/appraisalController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager'), getAppraisals);
router.get('/:id', authorize('super_admin', 'hr_manager'), getAppraisal);
router.post('/', authorize('super_admin', 'hr_manager'), createAppraisal);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateAppraisal);
router.delete('/:id', authorize('super_admin'), deleteAppraisal);

export default router;
