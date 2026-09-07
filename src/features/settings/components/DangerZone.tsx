/* ═════════════════════════════════════════════════════════════════════
   Settings — DangerZone
   Zone rouge pour les actions destructives, avec confirmation.
   ═════════════════════════════════════════════════════════════════════ */

import { useState, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';

interface DangerAction {
  title: string;
  description: string;
  buttonLabel: string;
  confirmTitle: string;
  confirmDescription: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
}

interface DangerZoneProps {
  actions: DangerAction[];
}

/* ═══════════════════════════════════════════════════════ */
export function DangerZone({ actions }: DangerZoneProps) {
  const [activeAction, setActiveAction] = useState<DangerAction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!activeAction) return;
    setLoading(true);
    try {
      await activeAction.onConfirm();
      setActiveAction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard>
      <div className="border-b border-border bg-danger-500/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-danger-400" />
          <h3 className="text-[14px] font-semibold text-danger-400">
            Danger Zone
          </h3>
        </div>
        <p className="mt-1 text-[12px] text-text-tertiary">
          Les actions suivantes sont irréversibles. Une confirmation est
          requise.
        </p>
      </div>

      <div className="divide-y divide-border">
        {actions.map((action) => (
          <div
            key={action.title}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text-primary">
                {action.title}
              </p>
              <p className="mt-0.5 text-[12px] text-text-tertiary">
                {action.description}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="shrink-0"
              onClick={() => setActiveAction(action)}
            >
              {action.buttonLabel}
            </Button>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        open={activeAction !== null}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        title={activeAction?.confirmTitle ?? ''}
        description={activeAction?.confirmDescription ?? null}
        confirmLabel={activeAction?.confirmLabel ?? 'Confirmer'}
        danger
        loading={loading}
      />
    </SettingsCard>
  );
}

export default DangerZone;

