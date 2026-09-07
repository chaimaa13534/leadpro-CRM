import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

/** The set of named actions a role may or may not perform. */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

/** A map of action -> boolean, where a missing key means "denied". */
export type PermissionMap = Partial<Record<PermissionAction, boolean>>;

/**
 * Role-based capabilities for the CRM.
 *
 * - admin   → full CRUD
 * - manager → read, create, update (no delete)
 * - sales   → read only
 * - support → read only
 */
const ROLE_CAPABILITIES: Record<string, PermissionMap> = {
  admin: { create: true, read: true, update: true, delete: true },
  manager: { create: true, read: true, update: true },
  sales: { create: true, read: true, update: true },
  support: { read: true },
};

/**
 * A reusable authorization middleware factory.
 *
 * `requirePermission({ read: true })` returns a middleware that rejects any
 * authenticated request whose role is not allowed to perform at least one of
 * the requested actions with a 403 Forbidden. It must be used AFTER
 * `requireAuth` so `req.user` is populated.
 *
 * @example
 *   router.delete('/', requireAuth, requirePermission({ delete: true }), deleteCompany);
 */
export function requirePermission(required: PermissionMap): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      next(ApiError.unauthorized('Authentication is required'));
      return;
    }

    const capabilities = ROLE_CAPABILITIES[userRole] ?? {};
    const requestedActions = Object.keys(required) as PermissionAction[];

    // Allow if the role is granted ANY of the requested actions.
    const allowed = requestedActions.some(
      (action) => capabilities[action] === true,
    );

    if (!allowed) {
      next(ApiError.forbidden('Access denied: insufficient permissions'));
      return;
    }

    next();
  };
}

/**
 * Compute the effective permission map for a given role slug. Useful for
 * the frontend to mirror the same rules without duplicating logic.
 */
export function capabilitiesForRole(role: string): PermissionMap {
  return ROLE_CAPABILITIES[role] ?? { read: false };
}
