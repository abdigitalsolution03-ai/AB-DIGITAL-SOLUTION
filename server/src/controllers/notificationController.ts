import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = { recipient: req.user?._id };
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user?._id, read: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: getPaginationMeta(total, page, limit),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user?._id },
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) { res.status(404).json({ success: false, message: 'Notification not found' }); return; }
    res.json({ success: true, data: notification, message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { recipient: req.user?._id, read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotification = async (
  recipientId: string,
  type: string,
  title: string,
  message: string,
  data?: any
): Promise<void> => {
  try {
    await Notification.create({ recipient: recipientId, type, title, message, data });
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};
