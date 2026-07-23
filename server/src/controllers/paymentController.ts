import { Response } from 'express';
import Payment from '../models/Payment';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.method) filter.method = req.query.method;
    if (req.query.invoice) filter.invoice = req.query.invoice;
    if (req.query.client) filter.client = req.query.client;

    const [payments, total] = await Promise.all([
      Payment.find(filter).populate('invoice', 'invoiceNumber total').populate('client', 'company').populate('receivedBy', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(filter),
    ]);

    res.json({ success: true, data: payments, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id).populate('invoice', 'invoiceNumber total').populate('client', 'company contactPerson').populate('receivedBy', 'username');
    if (!payment) { res.status(404).json({ success: false, message: 'Payment not found' }); return; }
    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.create({ ...req.body, receivedBy: req.user?._id });

    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      const totalPaid = await Payment.aggregate([
        { $match: { invoice: invoice._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      if (totalPaid.length > 0 && totalPaid[0].total >= invoice.total) {
        invoice.status = 'paid';
        invoice.paidDate = new Date();
        await invoice.save();
      }
    }

    await createAuditLog(req.user?._id, 'Create', 'Payment', payment._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: payment, message: 'Payment created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) { res.status(404).json({ success: false, message: 'Payment not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Payment', payment._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: payment, message: 'Payment updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) { res.status(404).json({ success: false, message: 'Payment not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Payment', payment._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { status: 'completed' };
    if (req.query.from) filter.createdAt = { $gte: new Date(req.query.from as string) };
    if (req.query.to) filter.createdAt = { ...filter.createdAt, $lte: new Date(req.query.to as string) };

    const report = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { method: '$method', month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    const totals = await Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { breakdown: report, totals: totals[0] || { total: 0, count: 0 } } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
