/* ═════════════════════════════════════════════════════════════════════
   Settings — OrganizationSettingsPage
   Logo, nom, secteur, coordonnées, adresse et description.
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { OrganizationForm } from '@/features/settings/components/OrganizationForm';
import { useNotifications } from '@/hooks/useNotifications';
import { organizationMock } from '@/features/settings/mocks';

/* ═══════════════════════════════════════════════════════ */
export function OrganizationSettingsPage() {
  const { success } = useNotifications();

  const handleSave = async () => {
    success('Organization updated.');
  };

  return (
    <div>
      <SettingsHeader
        title="Organization"
        description="Manage your company information visible to your team."
      />
      <OrganizationForm organization={organizationMock} onSave={handleSave} />
    </div>
  );
}

export default OrganizationSettingsPage;

