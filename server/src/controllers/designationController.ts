import { Response } from 'express';
import Designation from '../models/Designation';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getDesignations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.department) filter.department = req.query.department;

    const [designations, total] = await Promise.all([
      Designation.find(filter).populate('department', 'name').sort({ name: 1 }).skip(skip).limit(limit),
      Designation.countDocuments(filter),
    ]);

    res.json({ success: true, data: designations, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesignation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designation = await Designation.findById(req.params.id).populate('department', 'name');
    if (!designation) { res.status(404).json({ success: false, message: 'Designation not found' }); return; }
    res.json({ success: true, data: designation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDesignation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designation = await Designation.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Designation', designation._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: designation, message: 'Designation created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDesignation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designation = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!designation) { res.status(404).json({ success: false, message: 'Designation not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Designation', designation._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: designation, message: 'Designation updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDesignation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) { res.status(404).json({ success: false, message: 'Designation not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Designation', designation._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Designation deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
