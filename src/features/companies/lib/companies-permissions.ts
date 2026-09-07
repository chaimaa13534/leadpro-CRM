/**
 * Frontend mirror of the backend permission model.
 *
 * - admin   → full CRUD
 * - manager → read, create, update (no delete)
 * - sales   → read only
 * - support → read only
 *
 * Keeping the logic here (single source of truth for the UI) allows the page
 * to hide create / edit / delete buttons based on the current user's role
 * without duplicating the rules across components.
 */

export type CompanyPermissionAction = 'create' | 'read' | 'update' | 'delete';

export type CompanyRole = 'admin' | 'manager' | 'sales' | 'support';

interface CompanyPermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  /** Convenience: the user may perform at least one write action. */
  canManage: boolean;
}

const ROLE_PERMISSIONS: Record<CompanyRole, CompanyPermissions> = {
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
  sales: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManage: false,
  },
  support: {
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false,
    canManage: false,
  },
};

export function companyPermissionsForRole(role: string): CompanyPermissions {
  return ROLE_PERMISSIONS[role as CompanyRole] ?? ROLE_PERMISSIONS.support;
}
