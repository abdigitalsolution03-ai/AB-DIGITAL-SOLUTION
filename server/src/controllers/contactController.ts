import { Response } from 'express';
import Contact from '../models/Contact';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).populate('company', 'name').populate('lead', 'leadId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.json({ success: true, data: contacts, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id).populate('company', 'name').populate('lead', 'leadId');
    if (!contact) { res.status(404).json({ success: false, message: 'Contact not found' }); return; }
    res.json({ success: true, data: contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Contact', contact._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: contact, message: 'Contact created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!contact) { res.status(404).json({ success: false, message: 'Contact not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Contact', contact._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: contact, message: 'Contact updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) { res.status(404).json({ success: false, message: 'Contact not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Contact', contact._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
