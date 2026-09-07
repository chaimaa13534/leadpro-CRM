/* ═════════════════════════════════════════════════════════════════════
   Settings — IntegrationCard
   Carte d’intégration fictive : logo, nom, description, statut, actions.
   Aucune intégration réelle n’est contactée.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Settings2, Unplug, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { formatDate } from '@/utils/formatDate';
import type { Integration } from '@/features/settings/types';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (id: string) => Promise<void> | void;
  onDisconnect: (id: string) => Promise<void> | void;
}

const STATUS_VARIANTS: Record<Integration['status'], 'success' | 'neutral' | 'warning'> = {
  connected: 'success',
  available: 'neutral',
  coming_soon: 'warning',
};

const STATUS_LABELS: Record<Integration['status'], string> = {
  connected: 'Connected',
  available: 'Available',
  coming_soon: 'Coming soon',
};

/* ═══════════════════════════════════════════════════════ */
export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [busy, setBusy] = useState(false);

  const isConnected = integration.status === 'connected';
  const isComingSoon = integration.status === 'coming_soon';

  const handleConnect = async () => {
    setBusy(true);
    try {
      await onConnect(integration.id);
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setConfirmDisconnect(false);
    setBusy(true);
    try {
      await onDisconnect(integration.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsCard>
      <div className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-bold text-white"
              style={{ backgroundColor: integration.color }}
              aria-hidden="true"
            >
              {integration.name.charAt(0)}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary">
                {integration.name}
              </p>
              <Badge variant={STATUS_VARIANTS[integration.status]} dot>
                {STATUS_LABELS[integration.status]}
              </Badge>
            </div>
          </div>
        </div>

        <p className="flex-1 text-[12px] leading-relaxed text-text-tertiary">
          {integration.description}
        </p>

        {isConnected && integration.connectedAt && (
          <p className="text-[11px] text-text-disabled">
            Connecté le {formatDate(integration.connectedAt)}
          </p>
        )}

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDisconnect(true)}
                leadingIcon={<Unplug className="h-3.5 w-3.5" />}
              >
                Disconnect
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leadingIcon={<Settings2 className="h-3.5 w-3.5" />}
              >
                Configure
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={isComingSoon}
              onClick={handleConnect}
              loading={busy}
              leadingIcon={<Zap className="h-3.5 w-3.5" />}
            >
              {isComingSoon ? 'Coming soon' : 'Connect'}
            </Button>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDisconnect}
        onClose={() => setConfirmDisconnect(false)}
        onConfirm={handleDisconnect}
        title={`Déconnecter ${integration.name}`}
        description="La synchronisation sera interrompue. Vous pourrez vous reconnecter à tout moment."
        confirmLabel="Déconnecter"
        danger
        loading={busy}
      />
    </SettingsCard>
  );
}

export default IntegrationCard;

