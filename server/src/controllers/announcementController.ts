import { Response } from 'express';
import Announcement from '../models/Announcement';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const [announcements, total] = await Promise.all([
      Announcement.find(filter).populate('createdBy', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Announcement.countDocuments(filter),
    ]);

    res.json({ success: true, data: announcements, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.findById(req.params.id).populate('createdBy', 'username');
    if (!ann) { res.status(404).json({ success: false, message: 'Announcement not found' }); return; }
    res.json({ success: true, data: ann });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'Announcement', ann._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: ann, message: 'Announcement created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ann) { res.status(404).json({ success: false, message: 'Announcement not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Announcement', ann._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: ann, message: 'Announcement updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.findByIdAndDelete(req.params.id);
    if (!ann) { res.status(404).json({ success: false, message: 'Announcement not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Announcement', ann._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    if (!ann) { res.status(404).json({ success: false, message: 'Announcement not found' }); return; }
    res.json({ success: true, data: ann, message: 'Announcement published' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
