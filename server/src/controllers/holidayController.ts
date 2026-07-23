import { Response } from 'express';
import Holiday from '../models/Holiday';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getHolidays = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.year) filter.year = parseInt(req.query.year as string);
    if (req.query.type) filter.type = req.query.type;

    const [holidays, total] = await Promise.all([
      Holiday.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
      Holiday.countDocuments(filter),
    ]);

    res.json({ success: true, data: holidays, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHoliday = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) { res.status(404).json({ success: false, message: 'Holiday not found' }); return; }
    res.json({ success: true, data: holiday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const holiday = await Holiday.create({ ...req.body, year: new Date(req.body.date).getFullYear() });
    await createAuditLog(req.user?._id, 'Create', 'Holiday', holiday._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: holiday, message: 'Holiday created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHoliday = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };
    if (data.date) data.year = new Date(data.date).getFullYear();
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!holiday) { res.status(404).json({ success: false, message: 'Holiday not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Holiday', holiday._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: holiday, message: 'Holiday updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) { res.status(404).json({ success: false, message: 'Holiday not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Holiday', holiday._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Holiday deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
