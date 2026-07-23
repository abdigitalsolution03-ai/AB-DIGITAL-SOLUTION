import { Response } from 'express';
import Department from '../models/Department';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;

    const [departments, total] = await Promise.all([
      Department.find(filter).populate('hod', 'firstName lastName employeeId').sort({ name: 1 }).skip(skip).limit(limit),
      Department.countDocuments(filter),
    ]);

    const deptsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const empCount = await Employee.countDocuments({ department: dept._id, status: 'active' });
        return { ...dept.toObject(), employeeCount: empCount };
      })
    );

    res.json({ success: true, data: deptsWithCount, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dept = await Department.findById(req.params.id).populate('hod', 'firstName lastName employeeId');
    if (!dept) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }
    res.json({ success: true, data: dept });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dept = await Department.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Department', dept._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: dept, message: 'Department created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }
    await createAuditLog(req.user?._id, 'Update', 'Department', dept._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: dept, message: 'Department updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }
    await createAuditLog(req.user?._id, 'Delete', 'Department', dept._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Department deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
