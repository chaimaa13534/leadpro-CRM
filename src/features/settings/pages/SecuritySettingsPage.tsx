/* ═════════════════════════════════════════════════════════════════════
   Settings — SecuritySettingsPage
   Mot de passe, 2FA, sessions actives, activité de sécurité.
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { PasswordForm } from '@/features/settings/components/PasswordForm';
import { TwoFactorSettings } from '@/features/settings/components/TwoFactorSettings';
import { ActiveSessions } from '@/features/settings/components/ActiveSessions';
import { SecurityActivity } from '@/features/settings/components/SecurityActivity';
import { useNotifications } from '@/hooks/useNotifications';
import {
  twoFactorStatusMock,
  sessionsMock,
  securityActivityMock,
} from '@/features/settings/mocks';

/* ═══════════════════════════════════════════════════════ */
export function SecuritySettingsPage() {
  const { success } = useNotifications();

  const handleEnable2FA = async () => {
    success('2FA enabled (simulated).');
  };

  const handleDisable2FA = async () => {
    success('2FA disabled (simulated).');
  };

  const handleRevokeSession = async () => {
    success('Session revoked (simulated).');
  };

  return (
    <div>
      <SettingsHeader
        title="Security"
        description="Manage your password, 2FA, and active sessions."
      />

      <div className="flex flex-col gap-6">
        <PasswordForm onSave={async () => success('Password changed.')} />
        <TwoFactorSettings
          status={twoFactorStatusMock}
          onEnable={handleEnable2FA}
          onDisable={handleDisable2FA}
        />
        <ActiveSessions
          sessions={sessionsMock}
          onRevoke={handleRevokeSession}
        />
        <SecurityActivity events={securityActivityMock} />
      </div>
    </div>
  );
}

export default SecuritySettingsPage;

