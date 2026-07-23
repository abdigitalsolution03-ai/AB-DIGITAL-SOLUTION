import { Response } from 'express';
import Lead from '../models/Lead';
import Deal from '../models/Deal';
import Payment from '../models/Payment';
import Attendance from '../models/Attendance';
import Task from '../models/Task';
import Project from '../models/Project';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';

export const getSalesChart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const monthly = Array.from({ length: 12 }, (_, i) => {
      const found = data.find((d) => d._id.month === i + 1);
      return { month: i + 1, revenue: found?.revenue || 0, count: found?.count || 0 };
    });

    res.json({ success: true, data: monthly });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeadFunnel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const funnel = await Promise.all(
      stages.map(async (stage) => {
        const count = await Lead.countDocuments({ status: stage });
        return { stage, count };
      })
    );

    res.json({ success: true, data: funnel });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueGraph = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const years = await Payment.distinct('createdAt', { status: 'completed' }).then((dates) => {
      const yearsSet = new Set(dates.map((d: Date) => d.getFullYear()));
      return Array.from(yearsSet).sort();
    });

    const data = await Promise.all(
      years.slice(-3).map(async (year) => {
        const payments = await Payment.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return { year, revenue: payments[0]?.total || 0 };
      })
    );

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, status: '$status' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = await Employee.countDocuments({ status: 'active' });
    const tasksCompleted = await Task.countDocuments({ status: 'done' });
    const projectsCompleted = await Project.countDocuments({ status: 'completed' });
    const activeProjects = await Project.countDocuments({ status: { $in: ['planning', 'in-progress'] } });

    res.json({
      success: true,
      data: {
        employeeCount: total,
        tasksCompleted,
        projectsCompleted,
        activeProjects,
        avgTasksPerEmployee: total > 0 ? Math.round((tasksCompleted / total) * 10) / 10 : 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const byStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byPriority = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { byStatus, byPriority } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyGrowth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const [employeeGrowth, leadGrowth, revenueGrowth] = await Promise.all([
      Employee.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
          },
        },
        { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.month': 1 } },
      ]),
      Lead.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
          },
        },
        { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.month': 1 } },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
          },
        },
        { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: '$amount' } } },
        { $sort: { '_id.month': 1 } },
      ]),
    ]);

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      employees: employeeGrowth.find((e) => e._id.month === i + 1)?.count || 0,
      leads: leadGrowth.find((l) => l._id.month === i + 1)?.count || 0,
      revenue: revenueGrowth.find((r) => r._id.month === i + 1)?.total || 0,
    }));

    res.json({ success: true, data: monthly });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
