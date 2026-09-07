import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

/** The set of named actions a role may or may not perform on contacts. */
export type ContactPermissionAction = 'create' | 'read' | 'update' | 'delete';

/** A map of action -> boolean, where a missing key means "denied". */
export type ContactPermissionMap = Partial<Record<ContactPermissionAction, boolean>>;

/**
 * Contacts-specific role capabilities.
 *
 * Unlike the shared `requirePermission` (used by Companies where Sales is
 * read-only), the Contacts module grants Sales the ability to create and
 * update:
 *
 *   - admin   → full CRUD
 *   - manager → read, create, update (no delete)
 *   - sales   → read, create, update (no delete)
 *   - support → read only
 *
 * This keeps the global permission behavior untouched for the other
 * modules.
 */
const CONTACT_ROLE_CAPABILITIES: Record<string, ContactPermissionMap> = {
  admin: { create: true, read: true, update: true, delete: true },
  manager: { create: true, read: true, update: true },
  sales: { create: true, read: true, update: true },
  support: { read: true },
};

/**
 * Contacts-specific authorization middleware factory. Rejects any
 * authenticated request whose role is not allowed to perform at least one of
 * the requested actions with a 403 Forbidden. Must be used AFTER
 * `requireAuth` so `req.user` is populated.
 *
 * @example
 *   router.delete('/', requireAuth, requireContactPermission({ delete: true }), deleteContact);
 */
export function requireContactPermission(
  required: ContactPermissionMap,
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      next(ApiError.unauthorized('Authentication is required'));
      return;
    }

    const capabilities = CONTACT_ROLE_CAPABILITIES[userRole] ?? {};
    const requestedActions = Object.keys(required) as ContactPermissionAction[];

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
 * Compute the effective contact permission map for a given role slug.
 * Useful for the frontend to mirror the same rules without duplicating
 * logic (see `src/features/contacts/lib/contacts-permissions.ts`).
 */
export function contactCapabilitiesForRole(
  role: string,
): ContactPermissionMap {
  return CONTACT_ROLE_CAPABILITIES[role] ?? { read: false };
}

