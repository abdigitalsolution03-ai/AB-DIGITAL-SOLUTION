import { Response } from 'express';
import Appraisal from '../models/Appraisal';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getAppraisals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;

    const [appraisals, total] = await Promise.all([
      Appraisal.find(filter).populate('employee', 'firstName lastName employeeId').populate('reviewer', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Appraisal.countDocuments(filter),
    ]);

    res.json({ success: true, data: appraisals, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppraisal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appraisal = await Appraisal.findById(req.params.id).populate('employee', 'firstName lastName employeeId').populate('reviewer', 'username');
    if (!appraisal) { res.status(404).json({ success: false, message: 'Appraisal not found' }); return; }
    res.json({ success: true, data: appraisal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppraisal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appraisal = await Appraisal.create({ ...req.body, reviewer: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'Appraisal', appraisal._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: appraisal, message: 'Appraisal created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppraisal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appraisal = await Appraisal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!appraisal) { res.status(404).json({ success: false, message: 'Appraisal not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Appraisal', appraisal._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: appraisal, message: 'Appraisal updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAppraisal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appraisal = await Appraisal.findByIdAndDelete(req.params.id);
    if (!appraisal) { res.status(404).json({ success: false, message: 'Appraisal not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Appraisal', appraisal._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Appraisal deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
