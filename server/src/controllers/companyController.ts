import { Response } from 'express';
import Company from '../models/Company';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getCompanies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { domain: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.industry) filter.industry = req.query.industry;

    const [companies, total] = await Promise.all([
      Company.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Company.countDocuments(filter),
    ]);

    res.json({ success: true, data: companies, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) { res.status(404).json({ success: false, message: 'Company not found' }); return; }
    res.json({ success: true, data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Company', company._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: company, message: 'Company created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) { res.status(404).json({ success: false, message: 'Company not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Company', company._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: company, message: 'Company updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) { res.status(404).json({ success: false, message: 'Company not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Company', company._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Company deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
