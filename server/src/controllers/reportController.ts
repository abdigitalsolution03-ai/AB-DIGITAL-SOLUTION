import { Response } from 'express';
import Attendance from '../models/Attendance';
import Lead from '../models/Lead';
import Deal from '../models/Deal';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import Project from '../models/Project';
import Task from '../models/Task';
import Payroll from '../models/Payroll';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { getMonthRange } from '../utils/helpers';

export const getAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const { start, end } = getMonthRange(year, month);

    const records = await Attendance.find({ date: { $gte: start, $lte: end } }).populate('employee', 'firstName lastName employeeId department');

    const summary: any = {};
    records.forEach((r) => {
      const key = r.employee?._id?.toString() || 'unknown';
      if (!summary[key]) {
        summary[key] = { employee: r.employee, present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 };
      }
      if (r.status === 'present') summary[key].present++;
      else if (r.status === 'absent') summary[key].absent++;
      else if (r.status === 'late') summary[key].late++;
      else if (r.status === 'half-day') summary[key].halfDay++;
      summary[key].totalHours += r.workingHours || 0;
    });

    res.json({ success: true, data: Object.values(summary) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : new Date(new Date().getFullYear(), 0, 1);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const [deals, invoices, payments] = await Promise.all([
      Deal.find({ createdAt: { $gte: from, $lte: to } }).populate('assignedTo', 'username'),
      Invoice.find({ createdAt: { $gte: from, $lte: to } }),
      Payment.find({ createdAt: { $gte: from, $lte: to }, status: 'completed' }),
    ]);

    res.json({
      success: true,
      data: {
        deals: { total: deals.length, won: deals.filter((d) => d.stage === 'closed-won').length, value: deals.reduce((s, d) => s + d.amount, 0) },
        invoices: { total: invoices.length, paid: invoices.filter((i) => i.status === 'paid').length, totalAmount: invoices.reduce((s, i) => s + i.total, 0) },
        payments: { total: payments.length, totalAmount: payments.reduce((s, p) => s + p.amount, 0) },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeadsReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({}).populate('assignedTo', 'username');

    const bySource: any = {};
    const byStatus: any = {};
    leads.forEach((l) => {
      bySource[l.source] = (bySource[l.source] || 0) + 1;
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    });

    res.json({ success: true, data: { total: leads.length, bySource, byStatus, conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.convertedToClient).length / leads.length) * 100) : 0 } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    res.json({ success: true, data: { year, monthlyRevenue } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectsReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({}).populate('manager', 'username');
    const byStatus: any = {};
    projects.forEach((p) => {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    });

    res.json({ success: true, data: { total: projects.length, byStatus, avgProgress: projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0 } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const PerformanceReview = (await import('../models/PerformanceReview')).default;
    const reviews = await PerformanceReview.find({ status: 'completed' }).populate('employee', 'firstName lastName employeeId');

    const avgRating = reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + (r.overallRating || 0), 0) / reviews.length : 0;

    res.json({ success: true, data: { total: reviews.length, averageRating: Math.round(avgRating * 10) / 10, reviews } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayrollReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const payrolls = await Payroll.find({ month, year }).populate('employee', 'firstName lastName employeeId department');
    const totalGross = payrolls.reduce((s, p) => s + p.grossPay, 0);
    const totalNet = payrolls.reduce((s, p) => s + p.netPay, 0);
    const totalTax = payrolls.reduce((s, p) => s + p.tax, 0);
    const totalBonus = payrolls.reduce((s, p) => s + p.bonus, 0);

    res.json({ success: true, data: { month, year, count: payrolls.length, totalGross, totalNet, totalTax, totalBonus, payrolls } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find({}).populate('department', 'name').populate('designation', 'name');

    const byDepartment: any = {};
    const byStatus: any = {};
    employees.forEach((e) => {
      const dept = (e.department as any)?.name || 'Unassigned';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });

    res.json({ success: true, data: { total: employees.length, byDepartment, byStatus } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
