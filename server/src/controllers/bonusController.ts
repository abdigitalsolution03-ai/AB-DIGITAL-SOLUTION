import { Response } from 'express';
import Bonus from '../models/Bonus';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getBonuses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.type) filter.type = req.query.type;

    const [bonuses, total] = await Promise.all([
      Bonus.find(filter).populate('employee', 'firstName lastName employeeId').populate('approvedBy', 'username').sort({ date: -1 }).skip(skip).limit(limit),
      Bonus.countDocuments(filter),
    ]);

    res.json({ success: true, data: bonuses, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBonus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bonus = await Bonus.findById(req.params.id).populate('employee', 'firstName lastName employeeId').populate('approvedBy', 'username');
    if (!bonus) { res.status(404).json({ success: false, message: 'Bonus not found' }); return; }
    res.json({ success: true, data: bonus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBonus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bonus = await Bonus.create({ ...req.body, approvedBy: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'Bonus', bonus._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: bonus, message: 'Bonus created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBonus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bonus = await Bonus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bonus) { res.status(404).json({ success: false, message: 'Bonus not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Bonus', bonus._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: bonus, message: 'Bonus updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBonus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bonus = await Bonus.findByIdAndDelete(req.params.id);
    if (!bonus) { res.status(404).json({ success: false, message: 'Bonus not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Bonus', bonus._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Bonus deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
