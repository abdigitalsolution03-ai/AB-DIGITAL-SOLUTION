import { Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { calculateWorkingHours, paginateQuery, getPaginationMeta, getMonthRange } from '../utils/helpers';

export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findOne({ userId: req.user?._id });
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ employee: employee._id, date: today });
    if (existing && existing.checkIn) {
      res.status(400).json({ success: false, message: 'Already checked in today' });
      return;
    }

    const now = new Date();
    const lateThreshold = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0);
    const isLate = now > lateThreshold;

    let attendance;
    if (existing) {
      existing.checkIn = now;
      existing.status = isLate ? 'late' : 'present';
      existing.browserInfo = req.headers['user-agent'];
      existing.ipAddress = req.ip;
      if (req.body.geoLocation) existing.geoLocation = req.body.geoLocation;
      attendance = await existing.save();
    } else {
      attendance = await Attendance.create({
        employee: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? 'late' : 'present',
        browserInfo: req.headers['user-agent'],
        ipAddress: req.ip,
        geoLocation: req.body.geoLocation,
        deviceInfo: req.body.deviceInfo,
      });
    }

    await createAuditLog(req.user?._id, 'Create', 'Attendance', attendance._id.toString(), { action: 'check-in' }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: attendance, message: 'Check-in recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findOne({ userId: req.user?._id });
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance || !attendance.checkIn) {
      res.status(400).json({ success: false, message: 'No check-in found for today' });
      return;
    }

    if (attendance.checkOut) {
      res.status(400).json({ success: false, message: 'Already checked out today' });
      return;
    }

    attendance.checkOut = new Date();
    const { workingHours, overtime } = calculateWorkingHours(attendance.checkIn, attendance.checkOut, attendance.breakStart, attendance.breakEnd);
    attendance.workingHours = workingHours;
    attendance.overtime = overtime;
    await attendance.save();

    await createAuditLog(req.user?._id, 'Update', 'Attendance', attendance._id.toString(), { action: 'check-out' }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: attendance, message: 'Check-out recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const breakStart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findOne({ userId: req.user?._id });
    if (!employee) { res.status(404).json({ success: false, message: 'Employee not found' }); return; }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance || !attendance.checkIn) { res.status(400).json({ success: false, message: 'No check-in found' }); return; }
    if (attendance.breakStart && !attendance.breakEnd) { res.status(400).json({ success: false, message: 'Break already started' }); return; }

    attendance.breakStart = new Date();
    await attendance.save();
    res.json({ success: true, data: attendance, message: 'Break started' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const breakEnd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findOne({ userId: req.user?._id });
    if (!employee) { res.status(404).json({ success: false, message: 'Employee not found' }); return; }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance || !attendance.breakStart) { res.status(400).json({ success: false, message: 'No break started' }); return; }
    if (attendance.breakEnd) { res.status(400).json({ success: false, message: 'Break already ended' }); return; }

    attendance.breakEnd = new Date();
    if (attendance.checkIn && attendance.checkOut) {
      const { workingHours, overtime } = calculateWorkingHours(attendance.checkIn, attendance.checkOut, attendance.breakStart, attendance.breakEnd);
      attendance.workingHours = workingHours;
      attendance.overtime = overtime;
    }
    await attendance.save();
    res.json({ success: true, data: attendance, message: 'Break ended' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTodayAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findOne({ userId: req.user?._id });
    if (!employee) { res.status(404).json({ success: false, message: 'Employee not found' }); return; }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({ employee: employee._id, date: today });
    res.json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};

    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from as string);
      if (req.query.to) filter.date.$lte = new Date(req.query.to as string);
    }
    if (req.query.month && req.query.year) {
      const { start, end } = getMonthRange(parseInt(req.query.year as string), parseInt(req.query.month as string));
      filter.date = { $gte: start, $lte: end };
    }

    const [records, total] = await Promise.all([
      Attendance.find(filter).populate('employee', 'firstName lastName employeeId').sort({ date: -1 }).skip(skip).limit(limit),
      Attendance.countDocuments(filter),
    ]);

    const summary: any = {};
    records.forEach((r) => {
      if (!summary[r.status]) summary[r.status] = 0;
      summary[r.status]++;
    });

    res.json({ success: true, data: records, summary, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const y = parseInt(year as string) || new Date().getFullYear();
    const { start, end } = getMonthRange(y, m);

    const filter: any = { date: { $gte: start, $lte: end } };
    if (req.query.employee) filter.employee = req.query.employee;

    const records = await Attendance.find(filter).populate('employee', 'firstName lastName employeeId').sort({ date: 1 });
    res.json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
