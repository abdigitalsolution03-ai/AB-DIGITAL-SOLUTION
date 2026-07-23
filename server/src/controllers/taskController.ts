import { Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.milestone) filter.milestone = req.query.milestone;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.tags) filter.tags = { $in: (req.query.tags as string).split(',') };

    const [tasks, total] = await Promise.all([
      Task.find(filter).populate('assignedTo', 'username email').populate('assignedBy', 'username').populate('project', 'name').populate('milestone', 'name').sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.json({ success: true, data: tasks, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'username email').populate('assignedBy', 'username').populate('project', 'name').populate('milestone', 'name');
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const maxOrder = await Task.findOne({ project: req.body.project }).sort({ order: -1 }).select('order');
    const task = await Task.create({ ...req.body, assignedBy: req.user?._id, order: (maxOrder?.order || 0) + 1 });
    await createAuditLog(req.user?._id, 'Create', 'Task', task._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: task, message: 'Task created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Task', task._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: task, message: 'Task updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Task', task._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) { res.status(404).json({ success: false, message: 'Task not found' }); return; }

    if (task.project && status === 'done') {
      const total = await Task.countDocuments({ project: task.project });
      const done = await Task.countDocuments({ project: task.project, status: 'done' });
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;
      await Project.findByIdAndUpdate(task.project, { progress });
    }

    await createAuditLog(req.user?._id, 'Update', 'Task', task._id.toString(), { status }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: task, message: 'Task status updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tasks } = req.body;
    for (const t of tasks) {
      await Task.findByIdAndUpdate(t._id, { order: t.order, status: t.status });
    }
    res.json({ success: true, message: 'Task order updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
