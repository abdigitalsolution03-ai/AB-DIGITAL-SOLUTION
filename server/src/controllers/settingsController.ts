import { Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.group) filter.group = req.query.group;

    const [settings, total] = await Promise.all([
      Settings.find(filter).sort({ group: 1, key: 1 }).skip(skip).limit(limit),
      Settings.countDocuments(filter),
    ]);

    res.json({ success: true, data: settings, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const setting = await Settings.findById(req.params.id);
    if (!setting) { res.status(404).json({ success: false, message: 'Setting not found' }); return; }
    res.json({ success: true, data: setting });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await Settings.findOne({ key: req.body.key });
    if (existing) {
      existing.value = req.body.value;
      await existing.save();
      res.json({ success: true, data: existing, message: 'Setting updated' });
      return;
    }

    const setting = await Settings.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Settings', setting._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: setting, message: 'Setting created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const setting = await Settings.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!setting) { res.status(404).json({ success: false, message: 'Setting not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Settings', setting._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: setting, message: 'Setting updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const setting = await Settings.findByIdAndDelete(req.params.id);
    if (!setting) { res.status(404).json({ success: false, message: 'Setting not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Settings', setting._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Setting deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const backupSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await Settings.find({});
    const backup = {
      timestamp: new Date().toISOString(),
      createdBy: req.user?._id?.toString(),
      data: settings,
    };

    await createAuditLog(req.user?._id, 'Create', 'Settings', 'backup', { count: settings.length }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: backup, message: 'Backup created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
