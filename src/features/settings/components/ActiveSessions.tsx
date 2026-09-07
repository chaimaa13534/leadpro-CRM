/* ═════════════════════════════════════════════════════════════════════
   Settings — ActiveSessions
   Liste des sessions actives avec révocation (confirmation requise).
   Toutes les données sont fictives.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Monitor, Smartphone, Laptop, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { formatDate } from '@/utils/formatDate';
import type { SessionDevice } from '@/features/settings/types';

interface ActiveSessionsProps {
  sessions: SessionDevice[];
  loading?: boolean;
  onRevoke: (sessionId: string) => Promise<void> | void;
}

function DeviceIcon({
  device,
  browser,
}: {
  device: SessionDevice['device'];
  browser: SessionDevice['browser'];
}) {
  if (device === 'Mobile') return <Smartphone className="h-5 w-5" />;
  if (browser === 'Safari') return <Laptop className="h-5 w-5" />;
  return <Monitor className="h-5 w-5" />;
}

/* ═══════════════════════════════════════════════════════ */
export function ActiveSessions({
  sessions,
  loading = false,
  onRevoke,
}: ActiveSessionsProps) {
  const [pendingRevoke, setPendingRevoke] = useState<SessionDevice | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!pendingRevoke) return;
    setRevoking(true);
    try {
      await onRevoke(pendingRevoke.id);
      setPendingRevoke(null);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <SettingsSection
      title="Sessions actives"
      description="Appareils actuellement connectés à votre compte."
    >
      <SettingsCard>
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-text-secondary">
                  <DeviceIcon device={session.device} browser={session.browser} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-text-primary">
                      {session.browser} · {session.operatingSystem}
                    </p>
                    {session.isCurrent && <Badge variant="success">This device</Badge>}
                  </div>
                  <p className="text-[12px] text-text-tertiary">
                    {session.location} · Dernière activité :{' '}
                    {formatDate(session.lastActiveAt)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {session.isCurrent ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    leadingIcon={<ShieldCheck className="h-3.5 w-3.5" />}
                  >
                    Current
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingRevoke(session)}
                    leadingIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <ConfirmationDialog
        open={pendingRevoke !== null}
        onClose={() => setPendingRevoke(null)}
        onConfirm={handleRevoke}
        title="Révoquer la session"
        description={
          pendingRevoke
            ? `La session « ${pendingRevoke.browser} · ${pendingRevoke.operatingSystem} » (${pendingRevoke.location}) sera déconnectée. Continuer ?`
            : ''
        }
        confirmLabel="Révoquer"
        danger
        loading={revoking}
      />
    </SettingsSection>
  );
}

export default ActiveSessions;

