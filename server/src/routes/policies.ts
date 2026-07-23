import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getPolicies, getPolicy, createPolicy, updatePolicy, deletePolicy } from '../controllers/policyController';

const router = Router();

router.use(authenticate);
router.get('/', getPolicies);
router.get('/:id', getPolicy);
router.post('/', authorize('super_admin', 'hr_manager'), createPolicy);
router.put('/:id', authorize('super_admin', 'hr_manager'), updatePolicy);
router.delete('/:id', authorize('super_admin'), deletePolicy);

export default router;
