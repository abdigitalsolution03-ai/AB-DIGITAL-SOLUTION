import { Response } from 'express';
import PerformanceReview from '../models/PerformanceReview';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.reviewer) filter.reviewer = req.query.reviewer;

    const [reviews, total] = await Promise.all([
      PerformanceReview.find(filter).populate('employee', 'firstName lastName employeeId').populate('reviewer', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      PerformanceReview.countDocuments(filter),
    ]);

    res.json({ success: true, data: reviews, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await PerformanceReview.findById(req.params.id).populate('employee', 'firstName lastName employeeId').populate('reviewer', 'username');
    if (!review) { res.status(404).json({ success: false, message: 'Review not found' }); return; }
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await PerformanceReview.create({ ...req.body, reviewer: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'PerformanceReview', review._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: review, message: 'Review created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) { res.status(404).json({ success: false, message: 'Review not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'PerformanceReview', review._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: review, message: 'Review updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await PerformanceReview.findByIdAndDelete(req.params.id);
    if (!review) { res.status(404).json({ success: false, message: 'Review not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'PerformanceReview', review._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
