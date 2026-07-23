import { Response } from 'express';
import Employee from '../models/Employee';
import User from '../models/User';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta, generateEmployeeId } from '../utils/helpers';
import { sendWelcomeEmail } from '../utils/email';

export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { employeeId: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter).populate('department designation userId', '-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employee.countDocuments(filter),
    ]);

    res.json({ success: true, data: employees, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department designation userId', '-password');
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }
    res.json({ success: true, data: employee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, department, designation, salary, joiningDate, address, emergencyContact, bankDetails } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Employee with this email already exists' });
      return;
    }

    const employeeId = await generateEmployeeId();

    const tempPassword = 'Welcome@123';
    const user = await User.create({
      username: email.split('@')[0],
      email,
      password: tempPassword,
      role: 'employee',
      phone,
    });

    const employee = await Employee.create({
      employeeId,
      userId: user._id,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      address,
      emergencyContact,
      bankDetails,
    });

    await sendWelcomeEmail(email, tempPassword, `${firstName} ${lastName}`);
    await createAuditLog(req.user?._id, 'Create', 'Employee', employee._id.toString(), req.body, req.ip, req.headers['user-agent']);

    res.status(201).json({ success: true, data: employee, message: 'Employee created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }
    await createAuditLog(req.user?._id, 'Update', 'Employee', employee._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: employee, message: 'Employee updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }
    await User.findByIdAndUpdate(employee.userId, { status: 'inactive' });
    await createAuditLog(req.user?._id, 'Delete', 'Employee', employee._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeDirectory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = { status: 'active' };

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .populate('department designation', 'name')
        .select('employeeId firstName lastName email phone department designation')
        .sort({ firstName: 1 })
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(filter),
    ]);

    res.json({ success: true, data: employees, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeTimeline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id).select('employeeId firstName lastName');
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    const activities = await (await import('../models/ActivityLog')).default.find({
      $or: [{ resourceId: req.params.id }, { resourceId: employee.employeeId }],
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
