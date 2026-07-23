import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement, publishAnnouncement } from '../controllers/announcementController';

const router = Router();

router.use(authenticate);
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', authorize('super_admin', 'hr_manager'), createAnnouncement);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateAnnouncement);
router.delete('/:id', authorize('super_admin'), deleteAnnouncement);
router.post('/:id/publish', authorize('super_admin', 'hr_manager'), publishAnnouncement);

export default router;
