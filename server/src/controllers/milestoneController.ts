import { Response } from 'express';
import Milestone from '../models/Milestone';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getMilestones = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.status) filter.status = req.query.status;

    const [milestones, total] = await Promise.all([
      Milestone.find(filter).populate('project', 'name').sort({ dueDate: 1 }).skip(skip).limit(limit),
      Milestone.countDocuments(filter),
    ]);

    res.json({ success: true, data: milestones, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('project', 'name');
    if (!milestone) { res.status(404).json({ success: false, message: 'Milestone not found' }); return; }
    res.json({ success: true, data: milestone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const milestone = await Milestone.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Milestone', milestone._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: milestone, message: 'Milestone created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };
    if (data.status === 'completed') data.completedDate = new Date();
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!milestone) { res.status(404).json({ success: false, message: 'Milestone not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Milestone', milestone._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: milestone, message: 'Milestone updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) { res.status(404).json({ success: false, message: 'Milestone not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Milestone', milestone._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Milestone deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
