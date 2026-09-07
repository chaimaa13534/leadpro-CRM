import type { UserManagementRole } from '../types/user-management.types';

/** Role options for the user creation / edit forms. */
export const USER_ROLE_OPTIONS: {
  value: UserManagementRole;
  label: string;
}[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
];

/** Resolve a role slug to its display badge variant. */
export function roleBadgeVariant(role: UserManagementRole): 'primary' | 'info' | 'success' | 'warning' {
  switch (role) {
    case 'admin':
      return 'primary';
    case 'manager':
      return 'info';
    case 'sales':
      return 'success';
    case 'support':
      return 'warning';
  }
}

/** Human-readable label for a role slug. */
export function roleLabel(role: UserManagementRole): string {
  const found = USER_ROLE_OPTIONS.find((option) => option.value === role);
  return found?.label ?? role;
}
