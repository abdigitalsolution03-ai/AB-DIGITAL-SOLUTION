import { Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.manager) filter.manager = req.query.manager;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

    const [projects, total] = await Promise.all([
      Project.find(filter).populate('manager', 'username').populate('client', 'company').populate('team', 'username').populate('department', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    res.json({ success: true, data: projects, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'username email')
      .populate('client', 'company contactPerson')
      .populate('team', 'username email')
      .populate('department', 'name');
    if (!project) { res.status(404).json({ success: false, message: 'Project not found' }); return; }
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Project', project._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: project, message: 'Project created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) { res.status(404).json({ success: false, message: 'Project not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Project', project._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: project, message: 'Project updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) { res.status(404).json({ success: false, message: 'Project not found' }); return; }
    await Task.deleteMany({ project: project._id });
    await createAuditLog(req.user?._id, 'Delete', 'Project', project._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProjectProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { progress } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, { progress }, { new: true });
    if (!project) { res.status(404).json({ success: false, message: 'Project not found' }); return; }

    if (progress >= 100) {
      project.status = 'completed';
      project.endDate = new Date();
      await project.save();
    }

    await createAuditLog(req.user?._id, 'Update', 'Project', project._id.toString(), { progress }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: project, message: 'Progress updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getKanbanProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({}).populate('manager', 'username').sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
