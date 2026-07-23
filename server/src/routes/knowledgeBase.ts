import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle, voteArticle } from '../controllers/knowledgeBaseController';

const router = Router();

router.use(authenticate);
router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', authorize('super_admin', 'hr_manager'), createArticle);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateArticle);
router.delete('/:id', authorize('super_admin'), deleteArticle);
router.post('/:id/vote', voteArticle);

export default router;
