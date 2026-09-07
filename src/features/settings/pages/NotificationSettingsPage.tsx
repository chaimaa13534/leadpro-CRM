/* ═════════════════════════════════════════════════════════════════════
   Settings — NotificationSettingsPage
   Préférences de notification (email, desktop, push).
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { NotificationPreferences } from '@/features/settings/components/NotificationPreferences';

/* ═══════════════════════════════════════════════════════ */
export function NotificationSettingsPage() {
  return (
    <div>
      <SettingsHeader
        title="Notifications"
        description="Configure how and when you receive notifications."
      />
      <NotificationPreferences />
    </div>
  );
}

export default NotificationSettingsPage;

