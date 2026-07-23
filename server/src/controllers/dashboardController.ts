import { Response } from 'express';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import Project from '../models/Project';
import Task from '../models/Task';
import Lead from '../models/Lead';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../types';

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const [
      totalEmployees,
      activeEmployees,
      totalProjects,
      activeProjects,
      totalLeads,
      openLeads,
      pendingLeaves,
      todayAttendance,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalTasks,
      doneTasks,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['planning', 'in-progress'] } }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: { $nin: ['won', 'lost'] } }),
      Leave.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({ date: today, status: 'present' }),
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'paid' }),
      Invoice.countDocuments({ status: 'overdue' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'done' }),
    ]);

    res.json({
      success: true,
      data: {
        employees: { total: totalEmployees, active: activeEmployees },
        projects: { total: totalProjects, active: activeProjects },
        leads: { total: totalLeads, open: openLeads },
        leaves: { pending: pendingLeaves },
        attendance: { today: todayAttendance },
        invoices: { total: totalInvoices, paid: paidInvoices, overdue: overdueInvoices },
        tasks: { total: totalTasks, completed: doneTasks, completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0 },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ActivityLog = (await import('../models/ActivityLog')).default;
    const activities = await ActivityLog.find({})
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { status: { $ne: 'done' } };
    if (req.user?.role === 'employee') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'username')
      .populate('project', 'name')
      .sort({ dueDate: 1 })
      .limit(10);

    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
