import { Response } from 'express';
import KnowledgeBase from '../models/KnowledgeBase';
import { AuthRequest } from '../types';
import { createAuditLog } from '../middleware/audit';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const filter: any = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [articles, total] = await Promise.all([
      KnowledgeBase.find(filter).populate('createdBy', 'username').sort({ views: -1 }).skip(skip).limit(limit),
      KnowledgeBase.countDocuments(filter),
    ]);

    res.json({ success: true, data: articles, pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await KnowledgeBase.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('createdBy', 'username');
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await KnowledgeBase.create({ ...req.body, createdBy: req.user?._id });
    await createAuditLog(req.user?._id, 'Create', 'KnowledgeBase', article._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.status(201).json({ success: true, data: article, message: 'Article created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    await createAuditLog(req.user?._id, 'Update', 'KnowledgeBase', article._id.toString(), req.body, req.ip, req.headers['user-agent']);
    res.json({ success: true, data: article, message: 'Article updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }
    await createAuditLog(req.user?._id, 'Delete', 'KnowledgeBase', article._id.toString(), {}, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: 'Article deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { helpful } = req.body;
    const article = await KnowledgeBase.findById(req.params.id);
    if (!article) { res.status(404).json({ success: false, message: 'Article not found' }); return; }

    if (helpful) article.helpful.yes += 1;
    else article.helpful.no += 1;
    await article.save();

    res.json({ success: true, data: article, message: 'Vote recorded' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
