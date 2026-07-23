import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getContacts, getContact, createContact, updateContact, deleteContact } from '../controllers/contactController';

const router = Router();

router.use(authenticate);
router.get('/', getContacts);
router.get('/:id', getContact);
router.post('/', authorize('super_admin', 'sales_executive'), createContact);
router.put('/:id', authorize('super_admin', 'sales_executive'), updateContact);
router.delete('/:id', authorize('super_admin'), deleteContact);

export default router;
