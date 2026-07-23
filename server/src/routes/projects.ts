import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { getProjects, getProject, createProject, updateProject, deleteProject, updateProjectProgress, getKanbanProjects } from '../controllers/projectController';

const router = Router();

router.use(authenticate);
router.get('/', getProjects);
router.get('/kanban', getKanbanProjects);
router.get('/:id', getProject);
router.post('/', authorize('super_admin', 'hr_manager', 'team_leader'), createProject);
router.put('/:id', authorize('super_admin', 'hr_manager', 'team_leader'), updateProject);
router.delete('/:id', authorize('super_admin'), deleteProject);
router.patch('/:id/progress', authorize('super_admin', 'hr_manager', 'team_leader'), updateProjectProgress);

export default router;
