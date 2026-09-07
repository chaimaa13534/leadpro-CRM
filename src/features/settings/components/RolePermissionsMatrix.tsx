/* ═════════════════════════════════════════════════════════════════════
   Settings — RolePermissionsMatrix
   Matrice rôles × permissions (View / Create / Edit / Delete / Export).
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Check, Minus, Lock } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { cn } from '@/lib/cn';
import {
  permissionActions,
  permissionModules,
  rolesMock,
} from '@/features/settings/mocks';
import type {
  PermissionAction,
  PermissionModule,
  RoleDefinition,
} from '@/features/settings/types';

const ROLE_BADGE_VARIANTS: Record<RoleDefinition['color'], BadgeProps['variant']> = {
  accent: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

const MODULE_LABELS: Record<PermissionModule, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  contacts: 'Contacts',
  companies: 'Companies',
  opportunities: 'Opportunities',
  pipeline: 'Pipeline',
  calendar: 'Calendar',
  tasks: 'Tasks',
  reports: 'Reports',
  notifications: 'Notifications',
  ai_assistant: 'AI Assistant',
  settings: 'Settings',
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
};

/* ═══════════════════════════════════════════════════════ */
export function RolePermissionsMatrix() {
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(rolesMock[0]!);

  const togglePermission = (module: PermissionModule, action: PermissionAction) => {
    setSelectedRole((prev) => {
      const nextPermissions = {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module][action],
        },
      };
      return { ...prev, permissions: nextPermissions };
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sélecteur de rôle */}
      <div className="flex flex-wrap items-center gap-2">
        {rolesMock.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all duration-150',
              selectedRole.id === role.id
                ? 'border-accent bg-accent-subtle text-accent shadow-sm'
                : 'border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary',
            )}
            aria-pressed={selectedRole.id === role.id}
          >
            <Badge variant={ROLE_BADGE_VARIANTS[role.color]} dot />
            {role.label}
          </button>
        ))}
      </div>

      {/* Matrice */}
      <SettingsCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background-secondary/50">
                <th className="w-[160px] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Module
                </th>
                {permissionActions.map((action) => (
                  <th
                    key={action}
                    className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-text-tertiary"
                  >
                    {ACTION_LABELS[action]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {permissionModules.map((module) => (
                <tr key={module} className="group transition-colors hover:bg-surface-hover">
                  <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
                    {MODULE_LABELS[module]}
                  </td>
                  {permissionActions.map((action) => {
                    const value = selectedRole.permissions[module][action];
                    return (
                      <td key={action} className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(module, action)}
                          className={cn(
                            'inline-flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-150',
                            value
                              ? 'border-accent bg-accent text-white shadow-sm'
                              : 'border-border bg-surface text-text-disabled hover:border-border-hover',
                          )}
                          aria-pressed={value}
                          aria-label={`${MODULE_LABELS[module]} — ${ACTION_LABELS[action]}`}
                        >
                          {value ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <p className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
        <Lock className="h-3.5 w-3.5" />
        Les modifications sont appliquées localement (démo).
      </p>
    </div>
  );
}

export default RolePermissionsMatrix;

