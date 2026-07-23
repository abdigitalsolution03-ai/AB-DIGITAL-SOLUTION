import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getTickets, getTicket, createTicket, updateTicket, deleteTicket, addTicketComment } from '../controllers/ticketController';

const router = Router();

router.use(authenticate);
router.get('/', getTickets);
router.get('/:id', getTicket);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader', 'employee', 'client'), createTicket);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateTicket);
router.delete('/:id', authorize('super_admin'), deleteTicket);
router.post('/:id/comment', addTicketComment);

export default router;
