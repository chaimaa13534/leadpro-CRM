/* ═════════════════════════════════════════════════════════════════════
   Settings — AppearanceSettingsPage
   Thème, densité, sidebar, animations — délègue à AppearanceSettings.
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { AppearanceSettings } from '@/features/settings/components/AppearanceSettings';
import { useNotifications } from '@/hooks/useNotifications';

/* ═══════════════════════════════════════════════════════ */
export function AppearanceSettingsPage() {
  const { success } = useNotifications();

  return (
    <div>
      <SettingsHeader
        title="Appearance"
        description="Customize the look and feel of LeadPro."
      />
      <AppearanceSettings />
    </div>
  );
}

export default AppearanceSettingsPage;

