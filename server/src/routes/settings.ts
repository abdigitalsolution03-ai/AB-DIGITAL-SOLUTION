import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getSettings, getSetting, createSetting, updateSetting, deleteSetting, backupSettings } from '../controllers/settingsController';

const router = Router();

router.use(authenticate);
router.get('/', getSettings);
router.get('/:id', getSetting);
router.post('/', authorize('super_admin'), createSetting);
router.post('/backup', authorize('super_admin'), backupSettings);
router.put('/:id', authorize('super_admin'), updateSetting);
router.delete('/:id', authorize('super_admin'), deleteSetting);

export default router;
