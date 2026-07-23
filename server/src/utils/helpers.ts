import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

let employeeCounter = 0;

export const generateEmployeeId = async (): Promise<string> => {
  employeeCounter++;
  const year = new Date().getFullYear().toString().slice(-2);
  const num = String(employeeCounter).padStart(4, '0');
  return `EMP${year}${num}`;
};

let leadCounter = 0;

export const generateLeadId = async (): Promise<string> => {
  leadCounter++;
  const year = new Date().getFullYear().toString().slice(-2);
  const num = String(leadCounter).padStart(4, '0');
  return `LEAD${year}${num}`;
};

export const calculateWorkingHours = (checkIn: Date, checkOut: Date, breakStart?: Date, breakEnd?: Date): { workingHours: number; overtime: number } => {
  const totalMs = checkOut.getTime() - checkIn.getTime();
  let totalHours = totalMs / (1000 * 60 * 60);

  if (breakStart && breakEnd) {
    const breakMs = breakEnd.getTime() - breakStart.getTime();
    totalHours -= breakMs / (1000 * 60 * 60);
  }

  const regularHours = 8;
  const overtime = Math.max(0, totalHours - regularHours);
  const workingHours = Math.max(0, totalHours);

  return {
    workingHours: Math.round(workingHours * 100) / 100,
    overtime: Math.round(overtime * 100) / 100,
  };
};

export const getMonthRange = (year: number, month: number): { start: Date; end: Date } => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

export const generateTicketNumber = async (): Promise<string> => {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `TKT${year}${random}`;
};

export const paginateQuery = (page: number = 1, limit: number = 10) => {
  const p = Math.max(1, page);
  const l = Math.min(Math.max(1, limit), 100);
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const hashData = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(data, salt);
};
