/**
 * Frontend mirror of the backend permission model for contacts.
 *
 * The backend role slugs are `admin | manager | sales | support`; the
 * frontend auth provider normalizes these to `admin | manager | sales_rep |
 * viewer`. This module maps those normalized values to the contact
 * capabilities:
 *
 * - admin     → full CRUD
 * - manager   → read, create, update (no delete)
 * - sales_rep → read, create, update (no delete)
 * - viewer    → read only
 *
 * Note: The backend permission model for contacts differs from the global
 * model (sales can create/update contacts but not companies). This file
 * reflects that per-module override.
 */

export type ContactPermissionAction = 'create' | 'read' | 'update' | 'delete';

export type ContactRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

interface ContactPermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  /** Convenience: the user may perform at least one write action. */
  canManage: boolean;
}

const ROLE_PERMISSIONS: Record<ContactRole, ContactPermissions> = {
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManage: true,
  },
  manager: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManage: true,
  },
  sales_rep: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canManage: true,
  },
  viewer: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManage: false,
  },
};

export function contactPermissionsForRole(role: string): ContactPermissions {
  return ROLE_PERMISSIONS[role as ContactRole] ?? ROLE_PERMISSIONS.viewer;
}
