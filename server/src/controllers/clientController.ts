import { Response } from 'express';
import Client from '../models/Client';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { company: { $regex: req.query.search, $options: 'i' } },
        { contactPerson: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [clients, total] = await Promise.all([
      Client.find(filter).populate('userId', 'username email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Client.countDocuments(filter),
    ]);

    res.json({ success: true, data: clients, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id).populate('userId', 'username email');
    if (!client) { res.status(404).json({ success: false, message: 'Client not found' }); return; }
    res.json({ success: true, data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await Client.findOne({ email: req.body.email });
    if (existing) { res.status(400).json({ success: false, message: 'Client with this email already exists' }); return; }

    const client = await Client.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Client', client._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: client, message: 'Client created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) { res.status(404).json({ success: false, message: 'Client not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Client', client._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: client, message: 'Client updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) { res.status(404).json({ success: false, message: 'Client not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Client', client._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Client deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClientPortal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findOne({ userId: req.user?._id });
    if (!client) { res.status(404).json({ success: false, message: 'Client profile not found' }); return; }
    res.json({ success: true, data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
