import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getClients, getClient, createClient, updateClient, deleteClient, getClientPortal } from '../controllers/clientController';

const router = Router();

router.use(authenticate);
router.get('/', authorize('super_admin', 'hr_manager', 'team_leader', 'sales_executive'), getClients);
router.get('/portal', authorize('client'), getClientPortal);
router.get('/:id', authorize('super_admin', 'hr_manager', 'team_leader', 'sales_executive', 'client'), getClient);
router.post('/', authorize('super_admin', 'hr_manager', 'sales_executive'), createClient);
router.put('/:id', authorize('super_admin', 'hr_manager', 'sales_executive'), updateClient);
router.delete('/:id', authorize('super_admin'), deleteClient);

export default router;
