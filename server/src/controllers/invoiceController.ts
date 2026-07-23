import { Response } from 'express';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta, generateInvoiceNumber } from '../utils/helpers';
import { sendInvoiceEmail } from '../utils/email';

export const getInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.client) filter.client = req.query.client;
    if (req.query.search) filter.invoiceNumber = { $regex: req.query.search, $options: 'i' };

    const [invoices, total] = await Promise.all([
      Invoice.find(filter).populate('client', 'company contactPerson').populate('project', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments(filter),
    ]);

    res.json({ success: true, data: invoices, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client', 'company contactPerson email').populate('project', 'name');
    if (!invoice) { res.status(404).json({ success: false, message: 'Invoice not found' }); return; }
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const { items, subtotal, tax, discount } = req.body;
    const calculatedSubtotal = subtotal || items.reduce((s: number, i: any) => s + i.amount, 0);
    const calculatedTax = tax || 0;
    const calculatedDiscount = discount || 0;
    const total = calculatedSubtotal + calculatedTax - calculatedDiscount;

    const invoice = await Invoice.create({ ...req.body, invoiceNumber, subtotal: calculatedSubtotal, total });
    await createAuditLog(req.user?._id, 'Create', 'Invoice', invoice._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: invoice, message: 'Invoice created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) { res.status(404).json({ success: false, message: 'Invoice not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Invoice', invoice._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: invoice, message: 'Invoice updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) { res.status(404).json({ success: false, message: 'Invoice not found' }); return; }
    await Payment.deleteMany({ invoice: invoice._id });
    await createAuditLog(req.user?._id, 'Delete', 'Invoice', invoice._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client', 'company contactPerson email');
    if (!invoice) { res.status(404).json({ success: false, message: 'Invoice not found' }); return; }

    invoice.status = 'sent';
    await invoice.save();

    await sendInvoiceEmail(
      (invoice.client as any).email,
      invoice.invoiceNumber,
      invoice.total.toString(),
    );

    await createAuditLog(req.user?._id, 'Update', 'Invoice', invoice._id.toString(), { action: 'sent' }, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: invoice, message: 'Invoice sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) { res.status(404).json({ success: false, message: 'Invoice not found' }); return; }

    const payment = await Payment.create({
      invoice: invoice._id,
      client: invoice.client,
      amount: req.body.amount,
      method: req.body.method,
      transactionId: req.body.transactionId,
      notes: req.body.notes,
      receivedBy: req.user?._id,
      status: 'completed',
    });

    const totalPaid = await Payment.aggregate([
      { $match: { invoice: invoice._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    if (totalPaid.length > 0 && totalPaid[0].total >= invoice.total) {
      invoice.status = 'paid';
      invoice.paidDate = new Date();
      await invoice.save();
    }

    await createAuditLog(req.user?._id, 'Create', 'Payment', payment._id.toString(), { invoiceId: invoice._id }, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: payment, message: 'Payment recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
