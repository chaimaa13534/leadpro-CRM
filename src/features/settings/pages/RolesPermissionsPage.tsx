/* ═════════════════════════════════════════════════════════════════════
   Settings — RolesPermissionsPage
   Matrice rôles × permissions (View, Create, Edit, Delete, Export).
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { RolePermissionsMatrix } from '@/features/settings/components/RolePermissionsMatrix';

/* ═══════════════════════════════════════════════════════ */
export function RolesPermissionsPage() {
  return (
    <div>
      <SettingsHeader
        title="Roles & Permissions"
        description="Define what each role can access and modify."
      />
      <RolePermissionsMatrix />
    </div>
  );
}

export default RolesPermissionsPage;

