import { Response } from 'express';
import Ticket from '../models/Ticket';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta, generateTicketNumber } from '../utils/helpers';

export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.search) {
      filter.$or = [
        { subject: { $regex: req.query.search, $options: 'i' } },
        { ticketNumber: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      Ticket.find(filter).populate('assignedTo', 'username email').populate('client', 'company').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Ticket.countDocuments(filter),
    ]);

    res.json({ success: true, data: tickets, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo', 'username email').populate('client', 'company').populate('comments.user', 'username');
    if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }
    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticketNumber = await generateTicketNumber();
    const ticket = await Ticket.create({ ...req.body, ticketNumber });
    await createAuditLog(req.user?._id, 'Create', 'Ticket', ticket._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: ticket, message: 'Ticket created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Ticket', ticket._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: ticket, message: 'Ticket updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Ticket', ticket._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTicketComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) { res.status(404).json({ success: false, message: 'Ticket not found' }); return; }

    ticket.comments.push({
      user: req.user?._id,
      text: req.body.text,
      attachments: req.body.attachments || [],
      createdAt: new Date(),
    } as any);

      ticket.status = 'in-progress';
    await ticket.save();

    res.json({ success: true, data: ticket, message: 'Comment added' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
