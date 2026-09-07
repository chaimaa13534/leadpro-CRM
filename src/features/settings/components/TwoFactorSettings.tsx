/* ═════════════════════════════════════════════════════════════════════
   Settings — TwoFactorSettings
   Statut 2FA, activation/désactivation, codes de récupération.
   100 % simulé — aucun mécanisme réel d’authentification.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { ShieldCheck, ShieldOff, Smartphone, Mail, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Radio } from '@/components/ui/Radio';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import type { TwoFactorMethod, TwoFactorStatus } from '@/features/settings/types';

interface TwoFactorSettingsProps {
  status: TwoFactorStatus;
  loading?: boolean;
  onEnable: (method: TwoFactorMethod) => Promise<void> | void;
  onDisable: () => Promise<void> | void;
}

/* ═══════════════════════════════════════════════════════ */
export function TwoFactorSettings({
  status,
  loading = false,
  onEnable,
  onDisable,
}: TwoFactorSettingsProps) {
  const [method, setMethod] = useState<TwoFactorMethod>('app');
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnable = async () => {
    setBusy(true);
    try {
      await onEnable(method);
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setConfirmDisable(false);
    setBusy(true);
    try {
      await onDisable();
    } finally {
      setBusy(false);
    }
  };

  const handleCopyCodes = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        title="Statut de la 2FA"
        description="L’authentification à deux facteurs renforce la sécurité de votre compte."
      >
        <SettingsCard>
          <SettingsGroup>
            <SettingsRow
              title="Two-Factor Authentication"
              description={
                status.enabled
                  ? 'La vérification en deux étapes est active.'
                  : 'La vérification en deux étapes est désactivée.'
              }
            >
              <Badge
                variant={status.enabled ? 'success' : 'neutral'}
                dot
              >
                {status.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </SettingsRow>

            {!status.enabled ? (
              <SettingsRow
                title="Méthode d’authentification"
                description="Choisissez comment recevoir vos codes."
              >
                <div className="flex items-center gap-4">
                  <Radio
                    id="2fa-app"
                    name="2fa-method"
                    label={
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5" />
                        Authenticator App
                      </span>
                    }
                    checked={method === 'app'}
                    onChange={() => setMethod('app')}
                  />
                  <Radio
                    id="2fa-email"
                    name="2fa-method"
                    label={
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </span>
                    }
                    checked={method === 'email'}
                    onChange={() => setMethod('email')}
                  />
                </div>
              </SettingsRow>
            ) : (
              <SettingsRow
                title="Méthode utilisée"
                description={
                  status.method === 'app'
                    ? 'Codes générés par une application d’authentification.'
                    : 'Codes envoyés par email.'
                }
              >
                <Badge variant="primary" dot>
                  {status.method === 'app' ? 'Authenticator App' : 'Email'}
                </Badge>
              </SettingsRow>
            )}
          </SettingsGroup>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
            {status.enabled ? (
              <>
                <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
                  <ShieldCheck className="h-4 w-4 text-success-500" />
                  {status.recoveryCodesCount} codes de récupération disponibles
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCodes}
                    leadingIcon={
                      copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )
                    }
                  >
                    {copied ? 'Copied' : 'Copier les codes'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmDisable(true)}
                    loading={busy}
                    leadingIcon={<ShieldOff className="h-3.5 w-3.5" />}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnable}
                  loading={busy}
                  leadingIcon={<ShieldCheck className="h-3.5 w-3.5" />}
                >
                  Enable 2FA
                </Button>
              </div>
            )}
          </div>
        </SettingsCard>
      </SettingsSection>

      <ConfirmationDialog
        open={confirmDisable}
        onClose={() => setConfirmDisable(false)}
        onConfirm={handleDisable}
        title="Désactiver la 2FA"
        description="Votre compte sera moins protégé. Les codes de récupération seront invalidés. Continuer ?"
        confirmLabel="Désactiver"
        danger
      />
    </div>
  );
}

export default TwoFactorSettings;

