import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import cron from 'node-cron';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/db';
import { env } from './config/env';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import employeeRoutes from './routes/employees';
import departmentRoutes from './routes/departments';
import designationRoutes from './routes/designations';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leave';
import holidayRoutes from './routes/holidays';
import policyRoutes from './routes/policies';
import payrollRoutes from './routes/payroll';
import leadRoutes from './routes/leads';
import clientRoutes from './routes/clients';
import contactRoutes from './routes/contacts';
import companyRoutes from './routes/companies';
import dealRoutes from './routes/deals';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import invoiceRoutes from './routes/invoices';
import paymentRoutes from './routes/payments';
import documentRoutes from './routes/documents';
import ticketRoutes from './routes/tickets';
import knowledgeBaseRoutes from './routes/knowledgeBase';
import notificationRoutes from './routes/notifications';
import announcementRoutes from './routes/announcements';
import chatRoutes from './routes/chat';
import dashboardRoutes from './routes/dashboard';
import reportRoutes from './routes/reports';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';
import searchRoutes from './routes/search';
import milestoneRoutes from './routes/milestones';
import performanceReviewRoutes from './routes/performanceReviews';
import appraisalRoutes from './routes/appraisals';
import bonusRoutes from './routes/bonuses';

import { createAuditLog } from './middleware/audit';
import Employee from './models/Employee';
import Attendance from './models/Attendance';
import { sendBirthdayWish, sendAttendanceAlert } from './utils/email';
import { getMonthRange } from './utils/helpers';
import Leave from './models/Leave';
import ActivityLog from './models/ActivityLog';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/performance-reviews', performanceReviewRoutes);
app.use('/api/appraisals', appraisalRoutes);
app.use('/api/bonuses', bonusRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'AB Digital Solution API is running', timestamp: new Date().toISOString() });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: 'Validation Error', errors: Object.values(err.errors).map((e: any) => e.message) });
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(409).json({ success: false, message: `Duplicate value for ${field}` });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  res.status(statusCode).json({ success: false, message });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error('Authentication required'));
    return;
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, env.JWT_SECRET);
    (socket as any).userId = decoded.id;
    (socket as any).userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${(socket as any).userId}`);

  socket.join(`user:${(socket as any).userId}`);

  socket.on('join-chat', (chatId: string) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on('leave-chat', (chatId: string) => {
    socket.leave(`chat:${chatId}`);
  });

  socket.on('send-message', async (data: { chatId: string; content: string; attachments?: any[] }) => {
    try {
      const ChatMessage = (await import('./models/ChatMessage')).default;
      const Chat = (await import('./models/Chat')).default;

      const message = await ChatMessage.create({
        chat: data.chatId,
        sender: (socket as any).userId,
        content: data.content,
        attachments: data.attachments || [],
        readBy: [(socket as any).userId],
      });

      await Chat.findByIdAndUpdate(data.chatId, {
        lastMessage: data.content,
        lastMessageAt: new Date(),
      });

      const populated = await message.populate('sender', 'username email profilePicture');

      io.to(`chat:${data.chatId}`).emit('new-message', populated);
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('mark-read', async (data: { chatId: string; messageIds: string[] }) => {
    try {
      const ChatMessage = (await import('./models/ChatMessage')).default;
      await ChatMessage.updateMany(
        { _id: { $in: data.messageIds } },
        { $addToSet: { readBy: (socket as any).userId } }
      );
      io.to(`chat:${data.chatId}`).emit('messages-read', { messageIds: data.messageIds, userId: (socket as any).userId });
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
    socket.to(`chat:${data.chatId}`).emit('user-typing', {
      chatId: data.chatId,
      userId: (socket as any).userId,
      isTyping: data.isTyping,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${(socket as any).userId}`);
  });
});

cron.schedule('0 9 * * *', async () => {
  console.log('Running attendance reminder cron...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeEmployees = await Employee.find({ status: 'active' }).populate('userId');

    for (const emp of activeEmployees) {
      const attendance = await Attendance.findOne({ employee: emp._id, date: today });
      if (!attendance) {
        const user = emp.userId as any;
        if (user && user.email) {
          await sendAttendanceAlert(user.email, `${emp.firstName} ${emp.lastName}`, today.toLocaleDateString());
          await ActivityLog.create({
            user: user._id,
            action: 'Reminder',
            resource: 'Attendance',
            description: `Attendance reminder sent to ${emp.firstName} ${emp.lastName}`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Attendance reminder error:', error);
  }
});

cron.schedule('0 8 * * *', async () => {
  console.log('Running birthday reminder cron...');
  try {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;

    const employees = await Employee.find({ status: 'active' });

    for (const emp of employees) {
      if (emp.joiningDate) {
        const empDate = new Date(emp.joiningDate);
        const empStr = `${empDate.getMonth() + 1}-${empDate.getDate()}`;

        if (empStr === todayStr) {
          await sendBirthdayWish(emp.email, `${emp.firstName} ${emp.lastName}`);
          await ActivityLog.create({
            user: emp.userId,
            action: 'Birthday',
            resource: 'Employee',
            description: `Birthday wish sent to ${emp.firstName} ${emp.lastName}`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Birthday reminder error:', error);
  }
});

cron.schedule('0 7 * * *', async () => {
  console.log('Running follow-up reminder cron...');
  try {
    const today = new Date();
    const Lead = (await import('./models/Lead')).default;

    const leads = await Lead.find({
      followUpDate: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
      status: { $nin: ['won', 'lost'] },
    }).populate('assignedTo');

    for (const lead of leads) {
      if (lead.assignedTo) {
        const Notification = (await import('./models/Notification')).default;
        await Notification.create({
          recipient: lead.assignedTo._id,
          type: 'follow-up',
          title: 'Follow-up Reminder',
          message: `Follow up with ${lead.firstName} ${lead.lastName} from ${lead.company || 'N/A'}`,
          data: { leadId: lead._id, leadIdStr: lead.leadId },
        });
      }
    }
  } catch (error) {
    console.error('Follow-up reminder error:', error);
  }
});

cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly attendance cleanup/report...');
  try {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const { start, end } = getMonthRange(year, lastMonth);

    const absentEmployees = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: '$employee', daysPresent: { $sum: 1 }, totalHours: { $sum: '$workingHours' } } },
    ]);

    const totalWorkingDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    await ActivityLog.create({
      user: null as any,
      action: 'Report',
      resource: 'Attendance',
      description: `Monthly attendance report generated for ${lastMonth}/${year}. Total employees tracked: ${absentEmployees.length}`,
    });
  } catch (error) {
    console.error('Monthly report error:', error);
  }
});

const startServer = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║     AB Digital Solution - API Server      ║
    ║     Port: ${env.PORT.toString().padEnd(33)}║
    ║     Environment: ${env.NODE_ENV.padEnd(27)}║
    ║     MongoDB: ${env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@').padEnd(26)}║
    ╚═══════════════════════════════════════════╝
    `);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export { app, server, io };
