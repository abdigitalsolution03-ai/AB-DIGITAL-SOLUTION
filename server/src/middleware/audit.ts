import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import AuditLog from '../models/AuditLog';

interface AuditOptions {
  action: 'Create' | 'Read' | 'Update' | 'Delete' | 'Login' | 'Logout';
  resource: string;
  resourceId?: string;
  details?: any;
}

export const auditLog = (options: AuditOptions | ((req: AuthRequest) => AuditOptions)) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any): Response {
      const opts = typeof options === 'function' ? options(req) : options;

      const resourceId = opts.resourceId || req.params.id || body?.data?._id || body?.data?.id;

      AuditLog.create({
        user: req.user?._id,
        action: opts.action,
        resource: opts.resource,
        resourceId,
        details: opts.details || { body: req.body, params: req.params, query: req.query },
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
      }).catch((err) => console.error('Audit log error:', err));

      return originalJson(body);
    };

    next();
  };
};

export const createAuditLog = async (
  userId: string | undefined,
  action: string,
  resource: string,
  resourceId: string | undefined,
  details: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Audit log creation error:', error);
  }
};
