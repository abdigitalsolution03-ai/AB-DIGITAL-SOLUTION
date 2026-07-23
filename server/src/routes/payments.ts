import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getPayments, getPayment, createPayment, updatePayment, deletePayment, getPaymentReport } from '../controllers/paymentController';

const router = Router();

router.use(authenticate);
router.get('/', getPayments);
router.get('/report', authorize('super_admin', 'hr_manager'), getPaymentReport);
router.get('/:id', getPayment);
router.post('/', authorize('super_admin', 'hr_manager'), createPayment);
router.put('/:id', authorize('super_admin', 'hr_manager'), updatePayment);
router.delete('/:id', authorize('super_admin'), deletePayment);

export default router;
