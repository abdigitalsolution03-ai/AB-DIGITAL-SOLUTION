import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../types';
import { generateToken, generateRefreshToken } from '../utils/helpers';
import { sendPasswordResetEmail } from '../utils/email';
import { createAuditLog } from '../middleware/audit';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email or username already exists' });
      return;
    }

    const user = await User.create({ username, email, password, role, phone });
    const token = generateToken(user._id.toString(), user.role);

    await createAuditLog(user._id.toString(), 'Create', 'User', user._id.toString(), { action: 'User registered' }, req.ip, req.headers['user-agent']);

    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'Registration successful',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (user.status === 'inactive') {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date(),
    });
    await user.save();

    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    await createAuditLog(user._id.toString(), 'Login', 'User', user._id.toString(), { email }, req.ip, req.headers['user-agent']);

    res.json({
      success: true,
      data: { user: await User.findById(user._id), token, refreshToken },
      message: 'Login successful',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.set('resetPasswordToken', resetTokenHash);
    user.set('resetPasswordExpire', new Date(Date.now() + 3600000));
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    user.password = password;
    user.set('resetPasswordToken', undefined);
    user.set('resetPasswordExpire', undefined);
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
      .populate('role');
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedFields = ['username', 'phone', 'profilePicture'];
    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.user?._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select('+password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
