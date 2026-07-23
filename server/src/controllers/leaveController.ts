import { Response } from 'express';
import Leave from '../models/Leave';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';
import { sendLeaveNotification } from '../utils/email';

export const getLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.leaveType) filter.leaveType = req.query.leaveType;
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.user?.role === 'employee') {
      const emp = await Employee.findOne({ userId: req.user._id });
      if (emp) filter.employee = emp._id;
    }

    const [leaves, total] = await Promise.all([
      Leave.find(filter).populate('employee', 'firstName lastName employeeId').populate('approvedBy', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Leave.countDocuments(filter),
    ]);

    res.json({ success: true, data: leaves, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.findById(req.params.id).populate('employee', 'firstName lastName employeeId').populate('approvedBy', 'username').populate('comments.user', 'username');
    if (!leave) { res.status(404).json({ success: false, message: 'Leave not found' }); return; }
    res.json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emp = await Employee.findOne({ userId: req.user?._id });
    if (!emp && req.user?.role === 'employee') {
      res.status(404).json({ success: false, message: 'Employee profile not found' });
      return;
    }

    const employeeId = req.body.employee || emp?._id;
    const from = new Date(req.body.fromDate);
    const to = new Date(req.body.toDate);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({ ...req.body, employee: employeeId, days });
    await createAuditLog(req.user?._id, 'Create', 'Leave', leave._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: leave, message: 'Leave request submitted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!leave) { res.status(404).json({ success: false, message: 'Leave not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Leave', leave._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: leave, message: 'Leave updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) { res.status(404).json({ success: false, message: 'Leave not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Leave', leave._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Leave deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user?._id }, { new: true }).populate('employee');
    if (!leave) { res.status(404).json({ success: false, message: 'Leave not found' }); return; }

    const emp = await Employee.findById(leave.employee).populate('userId');
    if (emp) sendLeaveNotification(emp.email, leave.leaveType, 'approved', `${emp.firstName} ${emp.lastName}`);

    await createAuditLog(req.user?._id, 'Update', 'Leave', leave._id.toString(), { action: 'approved' }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: leave, message: 'Leave approved' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { comment } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) { res.status(404).json({ success: false, message: 'Leave not found' }); return; }

    leave.status = 'rejected';
    leave.approvedBy = req.user?._id;
    if (comment) leave.comments.push({ user: req.user?._id, text: comment, createdAt: new Date() } as any);
    await leave.save();

    const emp = await Employee.findById(leave.employee).populate('userId');
    if (emp) sendLeaveNotification(emp.email, leave.leaveType, 'rejected', `${emp.firstName} ${emp.lastName}`);

    await createAuditLog(req.user?._id, 'Update', 'Leave', leave._id.toString(), { action: 'rejected' }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: leave, message: 'Leave rejected' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
