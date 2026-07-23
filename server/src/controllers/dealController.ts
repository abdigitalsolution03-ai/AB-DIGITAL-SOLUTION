import { Response } from 'express';
import Deal from '../models/Deal';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getDeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.stage) filter.stage = req.query.stage;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

    const [deals, total] = await Promise.all([
      Deal.find(filter).populate('assignedTo', 'username').populate('lead', 'leadId firstName lastName').populate('contact', 'firstName lastName').populate('company', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Deal.countDocuments(filter),
    ]);

    res.json({ success: true, data: deals, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('lead', 'leadId firstName lastName email')
      .populate('contact', 'firstName lastName email')
      .populate('company', 'name');
    if (!deal) { res.status(404).json({ success: false, message: 'Deal not found' }); return; }
    res.json({ success: true, data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Deal', deal._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: deal, message: 'Deal created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) { res.status(404).json({ success: false, message: 'Deal not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Deal', deal._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: deal, message: 'Deal updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) { res.status(404).json({ success: false, message: 'Deal not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Deal', deal._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Deal deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDealStage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { stage } = req.body;
    const deal = await Deal.findById(req.params.id);
    if (!deal) { res.status(404).json({ success: false, message: 'Deal not found' }); return; }

    deal.stage = stage;
    if (stage === 'closed-won' || stage === 'closed-lost') {
      deal.actualCloseDate = new Date();
    }
    deal.activities.push({ type: 'stage_change', description: `Stage changed to ${stage}`, date: new Date() });
    await deal.save();

    await createAuditLog(req.user?._id, 'Update', 'Deal', deal._id.toString(), { stage }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: deal, message: 'Deal stage updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
