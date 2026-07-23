import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getConversations, createConversation, getMessages, sendMessage } from '../controllers/chatController';

const router = Router();

router.use(authenticate);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

export default router;
