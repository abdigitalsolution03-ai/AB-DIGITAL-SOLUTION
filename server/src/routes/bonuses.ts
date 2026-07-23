import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getBonuses, getBonus, createBonus, updateBonus, deleteBonus } from '../controllers/bonusController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager'), getBonuses);
router.get('/:id', authorize('super_admin', 'hr_manager'), getBonus);
router.post('/', authorize('super_admin', 'hr_manager'), createBonus);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateBonus);
router.delete('/:id', authorize('super_admin'), deleteBonus);

export default router;
