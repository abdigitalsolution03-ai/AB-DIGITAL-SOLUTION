import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getDesignations, getDesignation, createDesignation, updateDesignation, deleteDesignation } from '../controllers/designationController';

const router = Router();

router.use(authenticate);
router.get('/', getDesignations);
router.get('/:id', getDesignation);
router.post('/', authorize('super_admin', 'hr_manager'), createDesignation);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateDesignation);
router.delete('/:id', authorize('super_admin'), deleteDesignation);

export default router;
