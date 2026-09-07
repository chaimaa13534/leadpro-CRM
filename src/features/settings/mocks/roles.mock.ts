/* ═════════════════════════════════════════════════════════════════════
   Settings — Roles & Permissions Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type {
  PermissionAction,
  PermissionMap,
  PermissionModule,
  RoleDefinition,
} from '@/features/settings/types';

/** Modules de permission dans l’ordre d’affichage de la matrice. */
export const permissionModules: PermissionModule[] = [
  'dashboard',
  'leads',
  'contacts',
  'companies',
  'opportunities',
  'pipeline',
  'calendar',
  'tasks',
  'reports',
  'notifications',
  'ai_assistant',
  'settings',
];

/** Actions de permission dans l’ordre d’affichage de la matrice. */
export const permissionActions: PermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'export',
];

/** Construit une PermissionMap où toutes les actions d’un module valent `value`. */
function buildModule(value: boolean): Record<PermissionAction, boolean> {
  return {
    view: value,
    create: value,
    edit: value,
    delete: value,
    export: value,
  };
}

/** Rôle Viewer — lecture seule partout, aucun droit sur Settings. */
const viewerPermissions: PermissionMap = {
  dashboard: buildModule(true),
  leads: { ...buildModule(true), create: false, edit: false, delete: false, export: false },
  contacts: { ...buildModule(true), create: false, edit: false, delete: false, export: false },
  companies: { ...buildModule(true), create: false, edit: false, delete: false, export: false },
  opportunities: { ...buildModule(true), create: false, edit: false, delete: false, export: false },
  pipeline: buildModule(true),
  calendar: buildModule(true),
  tasks: { ...buildModule(true), create: false, edit: false, delete: false, export: false },
  reports: { ...buildModule(true), export: false },
  notifications: buildModule(true),
  ai_assistant: buildModule(true),
  settings: buildModule(false),
};

/** Rôle Marketing — accès CRM en création/édition, pas de suppression. */
const marketingPermissions: PermissionMap = {
  dashboard: buildModule(true),
  leads: { ...buildModule(true), delete: false },
  contacts: { ...buildModule(true), delete: false },
  companies: { ...buildModule(true), delete: false },
  opportunities: { ...buildModule(true), delete: false },
  pipeline: buildModule(true),
  calendar: buildModule(true),
  tasks: buildModule(true),
  reports: buildModule(true),
  notifications: buildModule(true),
  ai_assistant: buildModule(true),
  settings: buildModule(false),
};

/** Rôle Sales Rep — gère ses propres données, pas de Settings. */
const salesRepPermissions: PermissionMap = {
  dashboard: buildModule(true),
  leads: buildModule(true),
  contacts: buildModule(true),
  companies: buildModule(true),
  opportunities: buildModule(true),
  pipeline: buildModule(true),
  calendar: buildModule(true),
  tasks: buildModule(true),
  reports: { ...buildModule(true), export: false },
  notifications: buildModule(true),
  ai_assistant: buildModule(true),
  settings: buildModule(false),
};

/** Rôle Manager — accès élargi, rapports et exports inclus. */
const managerPermissions: PermissionMap = {
  dashboard: buildModule(true),
  leads: buildModule(true),
  contacts: buildModule(true),
  companies: buildModule(true),
  opportunities: buildModule(true),
  pipeline: buildModule(true),
  calendar: buildModule(true),
  tasks: buildModule(true),
  reports: buildModule(true),
  notifications: buildModule(true),
  ai_assistant: buildModule(true),
  settings: buildModule(false),
};

/** Rôle Admin — accès total, y compris Settings. */
const adminPermissions: PermissionMap = {
  dashboard: buildModule(true),
  leads: buildModule(true),
  contacts: buildModule(true),
  companies: buildModule(true),
  opportunities: buildModule(true),
  pipeline: buildModule(true),
  calendar: buildModule(true),
  tasks: buildModule(true),
  reports: buildModule(true),
  notifications: buildModule(true),
  ai_assistant: buildModule(true),
  settings: buildModule(true),
};

/** Rôles prédéfinis, avec une couleur d’identité pour l’interface. */
export const rolesMock: RoleDefinition[] = [
  {
    id: 'role-admin',
    key: 'admin',
    label: 'Admin',
    description: 'Accès complet à toutes les fonctionnalités et réglages.',
    color: 'danger',
    permissions: adminPermissions,
  },
  {
    id: 'role-manager',
    key: 'manager',
    label: 'Manager',
    description: 'Supervise une équipe commerciale et son pipeline.',
    color: 'warning',
    permissions: managerPermissions,
  },
  {
    id: 'role-sales-rep',
    key: 'sales_rep',
    label: 'Sales Representative',
    description: 'Gère ses propres leads, contacts et opportunités.',
    color: 'info',
    permissions: salesRepPermissions,
  },
  {
    id: 'role-marketing',
    key: 'marketing',
    label: 'Marketing',
    description: 'Crée et édite du contenu CRM, sans suppression.',
    color: 'success',
    permissions: marketingPermissions,
  },
  {
    id: 'role-viewer',
    key: 'viewer',
    label: 'Viewer',
    description: 'Accès en lecture seule, sans droit de modification.',
    color: 'accent',
    permissions: viewerPermissions,
  },
];

/** Liste des départements disponibles pour l’invitation et le tableau. */
export const departmentsMock: string[] = [
  'Sales',
  'Marketing',
  'Operations',
  'Customer Success',
  'Finance',
  'Engineering',
];

