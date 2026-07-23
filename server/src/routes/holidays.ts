import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getHolidays, getHoliday, createHoliday, updateHoliday, deleteHoliday } from '../controllers/holidayController';

const router = Router();

router.use(authenticate);
router.get('/', getHolidays);
router.get('/:id', getHoliday);
router.post('/', authorize('super_admin', 'hr_manager'), createHoliday);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateHoliday);
router.delete('/:id', authorize('super_admin'), deleteHoliday);

export default router;
