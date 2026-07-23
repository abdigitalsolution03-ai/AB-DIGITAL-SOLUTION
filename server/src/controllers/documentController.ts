import { Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { uploadToCloudinary } from '../middleware/upload';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = { type: 'file' };
    if (req.query.folder) filter.folder = req.query.folder;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tags) filter.tags = { $in: (req.query.tags as string).split(',') };

    const [docs, total] = await Promise.all([
      Document.find(filter).populate('uploadedBy', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Document.countDocuments(filter),
    ]);

    res.json({ success: true, data: docs, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doc = await Document.findById(req.params.id).populate('uploadedBy', 'username');
    if (!doc) { res.status(404).json({ success: false, message: 'Document not found' }); return; }
    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doc = await Document.create({ ...req.body, uploadedBy: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'Document', doc._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: doc, message: 'Document created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) { res.status(404).json({ success: false, message: 'Document not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'Document', doc._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: doc, message: 'Document updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) { res.status(404).json({ success: false, message: 'Document not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'Document', doc._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Document deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const cloudResult = await uploadToCloudinary(req.file.path);
    const doc = await Document.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      description: req.body.description,
      folder: req.body.folder,
      category: req.body.category,
      type: 'file',
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: cloudResult?.url || `/uploads/${req.file.filename}`,
      publicId: cloudResult?.publicId,
      uploadedBy: req.user?._id,
      tags: req.body.tags ? req.body.tags.split(',') : [],
    });

    await createAuditLog(req.user?._id, 'Create', 'Document', doc._id.toString(), { uploaded: true }, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: doc, message: 'File uploaded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFolders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const folders = await Document.find({ type: 'folder', folder: req.query.parent || null }).sort({ name: 1 });
    res.json({ success: true, data: folders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
