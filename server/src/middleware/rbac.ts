import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from '../types';

const roleHierarchy: Record<Role, number> = {
  super_admin: 100,
  hr_manager: 80,
  team_leader: 60,
  employee: 40,
  sales_executive: 40,
  client: 20,
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const userRole = req.user.role as Role;

    if (allowedRoles.includes(userRole)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${allowedRoles.join(', ')}. Your role: ${userRole}`,
    });
  };
};

export const authorizeMinLevel = (minRole: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const userLevel = roleHierarchy[req.user.role as Role] || 0;
    const requiredLevel = roleHierarchy[minRole] || 0;

    if (userLevel >= requiredLevel) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied. Minimum role required: ${minRole}`,
    });
  };
};

export const authorizeSelfOrRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const userId = req.params.id || req.params.userId;

    if (userId && req.user._id.toString() === userId) {
      next();
      return;
    }

    if (allowedRoles.includes(req.user.role as Role)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.',
    });
  };
};
