/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsRow
   Ligne de réglage : libellé + description à gauche, contrôle à droite.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SettingsRowProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsRow({
  title,
  description,
  children,
  className,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text-primary">{title}</p>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-text-tertiary">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}

export default SettingsRow;

