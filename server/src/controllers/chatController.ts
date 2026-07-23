import { Response } from 'express';
import Chat from '../models/Chat';
import ChatMessage from '../models/ChatMessage';
import { AuthRequest } from '../types';
import { paginateQuery, getPaginationMeta } from '../utils/helpers';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chats = await Chat.find({
      participants: req.user?._id,
    })
      .populate('participants', 'username email profilePicture')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: chats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { participants, type, groupName } = req.body;

    if (type === 'direct') {
      const otherUser = participants.find((p: string) => p !== req.user?._id?.toString());
      const existingChat = await Chat.findOne({
        type: 'direct',
        participants: { $all: [req.user?._id, otherUser], $size: 2 },
      });

      if (existingChat) {
        res.json({ success: true, data: existingChat });
        return;
      }
    }

    const allParticipants = [...new Set([...participants, req.user?._id?.toString()])];
    const chat = await Chat.create({
      participants: allParticipants,
      type: type || 'direct',
      groupName,
    });

    const populated = await chat.populate('participants', 'username email profilePicture');
    res.status(201).json({ success: true, data: populated, message: 'Conversation created' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = paginateQuery(parseInt(req.query.page as string), parseInt(req.query.limit as string));
    const chat = await Chat.findById(req.params.id);

    if (!chat) { res.status(404).json({ success: false, message: 'Chat not found' }); return; }
    if (!chat.participants.some((p) => p.toString() === req.user?._id?.toString())) {
      res.status(403).json({ success: false, message: 'Not a participant' });
      return;
    }

    const [messages, total] = await Promise.all([
      ChatMessage.find({ chat: req.params.id }).populate('sender', 'username email profilePicture').sort({ createdAt: -1 }).skip(skip).limit(limit),
      ChatMessage.countDocuments({ chat: req.params.id }),
    ]);

    res.json({ success: true, data: messages.reverse(), pagination: getPaginationMeta(total, page, limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) { res.status(404).json({ success: false, message: 'Chat not found' }); return; }
    if (!chat.participants.some((p) => p.toString() === req.user?._id?.toString())) {
      res.status(403).json({ success: false, message: 'Not a participant' });
      return;
    }

    const message = await ChatMessage.create({
      chat: req.params.id,
      sender: req.user?._id,
      content: req.body.content,
      attachments: req.body.attachments || [],
      readBy: [req.user?._id],
    });

    chat.lastMessage = req.body.content;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populated = await message.populate('sender', 'username email profilePicture');
    res.status(201).json({ success: true, data: populated, message: 'Message sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
