import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getLeads, getLead, createLead, updateLead, deleteLead, updateLeadStatus, convertLead } from '../controllers/leadController';

const router = Router();

router.use(authenticate);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', authorize('super_admin', 'team_leader', 'sales_executive'), createLead);
router.put('/:id', authorize('super_admin', 'team_leader', 'sales_executive'), updateLead);
router.delete('/:id', authorize('super_admin'), deleteLead);
router.patch('/:id/status', authorize('super_admin', 'team_leader', 'sales_executive'), updateLeadStatus);
router.post('/:id/convert', authorize('super_admin', 'team_leader', 'sales_executive'), convertLead);

export default router;
