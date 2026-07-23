import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getDeals, getDeal, createDeal, updateDeal, deleteDeal, updateDealStage } from '../controllers/dealController';

const router = Router();

router.use(authenticate);
router.get('/', getDeals);
router.get('/:id', getDeal);
router.post('/', authorize('super_admin', 'team_leader', 'sales_executive'), createDeal);
router.put('/:id', authorize('super_admin', 'team_leader', 'sales_executive'), updateDeal);
router.delete('/:id', authorize('super_admin'), deleteDeal);
router.patch('/:id/stage', authorize('super_admin', 'team_leader', 'sales_executive'), updateDealStage);

export default router;
