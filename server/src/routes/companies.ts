import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getCompanies, getCompany, createCompany, updateCompany, deleteCompany } from '../controllers/companyController';

const router = Router();

router.use(authenticate);
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.post('/', authorize('super_admin', 'sales_executive'), createCompany);
router.put('/:id', authorize('super_admin', 'sales_executive'), updateCompany);
router.delete('/:id', authorize('super_admin'), deleteCompany);

export default router;
