import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: { filename: string; content: Buffer | string }[];
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.log('Email not configured. Skipping email send.');
      console.log(`To: ${options.to}, Subject: ${options.subject}`);
      return false;
    }

    const info = await transporter.sendMail({
      from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, password: string, name: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Welcome to ${env.APP_NAME}`,
    html: `
      <h1>Welcome to ${env.APP_NAME}!</h1>
      <p>Hello ${name},</p>
      <p>Your account has been created. Here are your login credentials:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please change your password after your first login.</p>
      <p><a href="${env.CLIENT_URL}/login">Login here</a></p>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const sendLeaveNotification = async (email: string, type: string, status: string, name: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Leave ${status} - ${type}`,
    html: `
      <h1>Leave ${status}</h1>
      <p>Dear ${name},</p>
      <p>Your ${type} leave request has been <strong>${status}</strong>.</p>
      <p>Please check your portal for details.</p>
    `,
  });
};

export const sendInvoiceEmail = async (email: string, invoiceNumber: string, amount: string, pdfBuffer?: Buffer): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Invoice ${invoiceNumber} - ${amount}`,
    html: `
      <h1>Invoice ${invoiceNumber}</h1>
      <p>Please find your invoice attached.</p>
      <p><strong>Amount Due:</strong> ${amount}</p>
      <p>Thank you for your business!</p>
    `,
    attachments: pdfBuffer ? [{ filename: `invoice-${invoiceNumber}.pdf`, content: pdfBuffer }] : undefined,
  });
};

export const sendBirthdayWish = async (email: string, name: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Happy Birthday ${name}! 🎂`,
    html: `
      <h1>Happy Birthday!</h1>
      <p>Dear ${name},</p>
      <p>Wishing you a fantastic birthday filled with joy and happiness!</p>
      <p>From the entire ${env.APP_NAME} team.</p>
    `,
  });
};

export const sendAttendanceAlert = async (email: string, name: string, date: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: 'Attendance Reminder',
    html: `
      <h1>Attendance Alert</h1>
      <p>Dear ${name},</p>
      <p>You have not marked your attendance for ${date}.</p>
      <p>Please check in through the portal.</p>
    `,
  });
};
