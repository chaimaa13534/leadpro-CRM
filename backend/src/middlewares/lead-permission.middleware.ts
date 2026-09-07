import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

/** The set of named actions a role may or may not perform on leads. */
export type LeadPermissionAction = 'create' | 'read' | 'update' | 'delete';

/** A map of action -> boolean, where a missing key means "denied". */
export type LeadPermissionMap = Partial<Record<LeadPermissionAction, boolean>>;

/**
 * Leads-specific role capabilities.
 *
 * Mirrors the Contacts module (Sales can create/update leads) so the Sales
 * team can manage their prospects without loosening the global rules:
 *
 *   - admin   → full CRUD
 *   - manager → read, create, update (no delete)
 *   - sales   → read, create, update (no delete)
 *   - support → read only
 */
const LEAD_ROLE_CAPABILITIES: Record<string, LeadPermissionMap> = {
  admin: { create: true, read: true, update: true, delete: true },
  manager: { create: true, read: true, update: true },
  sales: { create: true, read: true, update: true },
  support: { read: true },
};

/**
 * Leads-specific authorization middleware factory. Rejects any
 * authenticated request whose role is not allowed to perform at least one of
 * the requested actions with a 403 Forbidden. Must be used AFTER
 * `requireAuth` so `req.user` is populated.
 *
 * @example
 *   router.delete('/', requireAuth, requireLeadPermission({ delete: true }), deleteLead);
 */
export function requireLeadPermission(
  required: LeadPermissionMap,
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      next(ApiError.unauthorized('Authentication is required'));
      return;
    }

    const capabilities = LEAD_ROLE_CAPABILITIES[userRole] ?? {};
    const requestedActions = Object.keys(required) as LeadPermissionAction[];

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
 * Compute the effective lead permission map for a given role slug.
 * Useful for the frontend to mirror the same rules without duplicating
 * logic (see `src/features/leads/lib/leads-permissions.ts`).
 */
export function leadCapabilitiesForRole(role: string): LeadPermissionMap {
  return LEAD_ROLE_CAPABILITIES[role] ?? { read: false };
}
