import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'hr_manager' | 'team_leader' | 'employee' | 'sales_executive' | 'client';
  status: 'active' | 'inactive';
  profilePicture?: string;
  phone?: string;
  emailVerified: boolean;
  lastLogin?: Date;
  loginHistory: { ip: string; userAgent: string; timestamp: Date }[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Role = 'super_admin' | 'hr_manager' | 'team_leader' | 'employee' | 'sales_executive' | 'client';
