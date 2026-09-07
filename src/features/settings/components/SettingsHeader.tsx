/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsHeader
   En-tête de section : titre, description et zone d’actions.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SettingsHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsHeader({
  title,
  description,
  icon,
  actions,
  className,
}: SettingsHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent">
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="text-[18px] font-semibold tracking-tight text-text-primary">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-text-tertiary">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export default SettingsHeader;

