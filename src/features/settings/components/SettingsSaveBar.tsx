/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsSaveBar
   Barre de sauvegarde collante en bas de page avec feedback de sauvegarde.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface SettingsSaveBarProps {
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
  saved?: boolean;
  dirty?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
  children?: ReactNode;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsSaveBar({
  onSave,
  onCancel,
  saving = false,
  saved = false,
  dirty = false,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  className,
  children,
}: SettingsSaveBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated/95 px-4 py-3 shadow-lg backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {saving ? (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12px] text-text-tertiary"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Enregistrement…
            </motion.span>
          ) : saved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12px] font-medium text-success-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Enregistré
            </motion.span>
          ) : dirty ? (
            <span className="text-[12px] text-text-tertiary">
              Modifications non enregistrées
            </span>
          ) : null}
        </AnimatePresence>
        {children}
      </div>
      <div className="flex items-center gap-2">
        {onCancel ? (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button size="sm" onClick={onSave} loading={saving} disabled={!dirty && !saving}>
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}

export default SettingsSaveBar;

