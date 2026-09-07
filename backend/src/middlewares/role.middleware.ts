import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

/**
 * Role-based authorization middleware factory.
 *
 * `requireRole('admin')` returns a middleware that rejects any authenticated
 * request whose role is not an admin with a 403 Forbidden. It must be used
 * AFTER `requireAuth` so `req.user` is populated.
 *
 * @example
 *   router.post('/', requireAuth, requireRole('admin'), createUser);
 */
export function requireRole(role: string): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      next(ApiError.unauthorized('Authentication is required'));
      return;
    }

    if (userRole !== role) {
      next(ApiError.forbidden(`Access denied: ${role} role required`));
      return;
    }

    next();
  };
}
