import { Response } from 'express';
import Lead from '../models/Lead';
import Client from '../models/Client';
import User from '../models/User';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta, generateLeadId } from '../utils/helpers';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter).populate('assignedTo', 'username email').populate('client', 'company').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.json({ success: true, data: leads, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'username email').populate('client', 'company');
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leadId = await generateLeadId();
    const lead = await Lead.create({ ...req.body, leadId });
    await createAuditLog(req.user?._id, 'Create', 'Lead', lead._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: lead, message: 'Lead created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Lead', lead._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: lead, message: 'Lead updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Lead', lead._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeadStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, lostReason } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }

    lead.status = status;
    if (status === 'lost') lead.lostReason = lostReason;
    lead.activities.push({ type: 'status_change', description: `Status changed to ${status}`, date: new Date() });

    if (status === 'won') {
      lead.convertedToClient = true;
    }

    await lead.save();
    await createAuditLog(req.user?._id, 'Update', 'Lead', lead._id.toString(), { status }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: lead, message: 'Lead status updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const convertLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }

    if (lead.convertedToClient) {
      res.status(400).json({ success: false, message: 'Lead already converted' });
      return;
    }

    const user = await User.create({
      username: lead.email.split('@')[0],
      email: lead.email,
      password: 'Welcome@123',
      role: 'client',
      phone: lead.phone,
    });

    const client = await Client.create({
      userId: user._id,
      company: lead.company || `${lead.firstName} ${lead.lastName}`,
      contactPerson: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
    });

    lead.convertedToClient = true;
    lead.client = client._id;
    lead.status = 'won';
    await lead.save();

    await createAuditLog(req.user?._id, 'Update', 'Lead', lead._id.toString(), { action: 'converted', clientId: client._id }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: { lead, client }, message: 'Lead converted to client' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
