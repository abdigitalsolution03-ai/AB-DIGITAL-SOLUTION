import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { getDocuments, getDocument, createDocument, updateDocument, deleteDocument, uploadDocument, getFolders } from '../controllers/documentController';

const router = Router();

router.use(authenticate);
router.get('/', getDocuments);
router.get('/folders', getFolders);
router.get('/:id', getDocument);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createDocument);
router.post('/upload', authorize('super_admin', 'hr_manager', 'team_leader', 'employee'), upload.single('file'), uploadDocument);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateDocument);
router.delete('/:id', authorize('super_admin'), deleteDocument);

export default router;
