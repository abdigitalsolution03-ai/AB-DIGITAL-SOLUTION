import { Response } from 'express';
import Policy from '../models/Policy';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getPolicies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const [policies, total] = await Promise.all([
      Policy.find(filter).populate('createdBy', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Policy.countDocuments(filter),
    ]);

    res.json({ success: true, data: policies, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const policy = await Policy.findById(req.params.id).populate('createdBy', 'username');
    if (!policy) { res.status(404).json({ success: false, message: 'Policy not found' }); return; }
    res.json({ success: true, data: policy });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const policy = await Policy.create({ ...req.body, createdBy: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'Policy', policy._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: policy, message: 'Policy created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) { res.status(404).json({ success: false, message: 'Policy not found' }); return; }

    const data = { ...req.body, version: policy.version + 1 };
    const updated = await Policy.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    await createAuditLog(req.user?._id, 'Update', 'Policy', updated!._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: updated, message: 'Policy updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) { res.status(404).json({ success: false, message: 'Policy not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Policy', policy._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Policy deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
