import { Response } from 'express';
import Payroll from '../models/Payroll';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getPayrolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.month) filter.month = parseInt(req.query.month as string);
    if (req.query.year) filter.year = parseInt(req.query.year as string);
    if (req.query.status) filter.paymentStatus = req.query.status;
    if (req.query.employee) filter.employee = req.query.employee;

    if (req.user?.role === 'employee') {
      const emp = await Employee.findOne({ userId: req.user._id });
      if (emp) filter.employee = emp._id;
    }

    const [payrolls, total] = await Promise.all([
      Payroll.find(filter).populate('employee', 'firstName lastName employeeId department').sort({ year: -1, month: -1 }).skip(skip).limit(limit),
      Payroll.countDocuments(filter),
    ]);

    res.json({ success: true, data: payrolls, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee', 'firstName lastName employeeId department designation');
    if (!payroll) { res.status(404).json({ success: false, message: 'Payroll not found' }); return; }
    res.json({ success: true, data: payroll });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payroll = await Payroll.create(req.body);
    await createAuditLog(req.user?._id, 'Create', 'Payroll', payroll._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: payroll, message: 'Payroll created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payroll) { res.status(404).json({ success: false, message: 'Payroll not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Payroll', payroll._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: payroll, message: 'Payroll updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) { res.status(404).json({ success: false, message: 'Payroll not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Payroll', payroll._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Payroll deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { month, year } = req.body;
    const employees = await Employee.find({ status: 'active' });

    const payrolls = [];
    for (const emp of employees) {
      const existing = await Payroll.findOne({ employee: emp._id, month, year });
      if (!existing) {
        const allowances = [
          { name: 'House Rent Allowance', amount: Math.round(emp.salary * 0.2) },
          { name: 'Dearness Allowance', amount: Math.round(emp.salary * 0.1) },
          { name: 'Medical Allowance', amount: 1250 },
        ];
        const deductions = [
          { name: 'Provident Fund', amount: Math.round(emp.salary * 0.12) },
          { name: 'Professional Tax', amount: 200 },
        ];
        const totalAllowances = allowances.reduce((s, a) => s + a.amount, 0);
        const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
        const grossPay = emp.salary + totalAllowances;
        const tax = Math.round(grossPay * 0.05);
        const netPay = grossPay - totalDeductions - tax;

        payrolls.push({
          employee: emp._id,
          month,
          year,
          basicSalary: emp.salary,
          allowances,
          deductions,
          grossPay,
          netPay,
          bonus: 0,
          tax,
        });
      }
    }

    if (payrolls.length > 0) {
      await Payroll.insertMany(payrolls);
    }

    await createAuditLog(req.user?._id, 'Create', 'Payroll', 'bulk', { month, year, count: payrolls.length }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: { generated: payrolls.length }, message: `Generated ${payrolls.length} payroll entries` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalarySlips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emp = await Employee.findOne({ userId: req.user?._id });
    if (!emp) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }
    const slips = await Payroll.find({ employee: emp._id }).sort({ year: -1, month: -1 }).limit(12);
    res.json({ success: true, data: slips });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
