import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, sendInvoice, addPayment } from '../controllers/invoiceController';

const router = Router();

router.use(authenticate);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createInvoice);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateInvoice);
router.delete('/:id', authorize('super_admin'), deleteInvoice);
router.post('/:id/send', authorize('super_admin', 'hr_manager'), sendInvoice);
router.post('/:id/payment', authorize('super_admin', 'hr_manager'), addPayment);

export default router;
