import { Response } from 'express';
import Employee from '../models/Employee';
import User from '../models/User';
import Client from '../models/Client';
import Lead from '../models/Lead';
import Project from '../models/Project';
import Task from '../models/Task';
import Ticket from '../models/Ticket';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../types';

export const globalSearch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) {
      res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
      return;
    }

    const regex = new RegExp(q, 'i');

    const [employees, users, clients, leads, projects, tasks, tickets, invoices] = await Promise.all([
      Employee.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { employeeId: regex },
        ],
      }).select('firstName lastName email employeeId').limit(5),

      User.find({
        $or: [
          { username: regex },
          { email: regex },
        ],
      }).select('username email role').limit(5),

      Client.find({
        $or: [
          { company: regex },
          { contactPerson: regex },
          { email: regex },
        ],
      }).select('company contactPerson email').limit(5),

      Lead.find({
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { company: regex },
          { leadId: regex },
        ],
      }).select('firstName lastName email company leadId status').limit(5),

      Project.find({ name: regex }).select('name status').limit(5),

      Task.find({ title: regex }).select('title status').limit(5),

      Ticket.find({
        $or: [
          { subject: regex },
          { ticketNumber: regex },
          { description: regex },
        ],
      }).select('subject ticketNumber status').limit(5),

      Invoice.find({
        $or: [
          { invoiceNumber: regex },
        ],
      }).select('invoiceNumber status total').limit(5),
    ]);

    res.json({
      success: true,
      data: {
        employees,
        users,
        clients,
        leads,
        projects,
        tasks,
        tickets,
        invoices,
        total: employees.length + users.length + clients.length + leads.length + projects.length + tasks.length + tickets.length + invoices.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
