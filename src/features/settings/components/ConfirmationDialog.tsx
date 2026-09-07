/* ═════════════════════════════════════════════════════════════════════
   Settings — ConfirmationDialog
   Boîte de dialogue de confirmation des actions sensibles, basée sur le
   `Modal` du design system.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  loading = false,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {danger ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger-500/10 text-danger-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 text-[13px] leading-relaxed text-text-secondary">
            {description}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;

