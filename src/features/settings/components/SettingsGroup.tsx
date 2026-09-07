/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsGroup
   Groupe de lignes à l’intérieur d’une carte, séparées par des bordures.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SettingsGroupProps {
  children: ReactNode;
  className?: string;
  divided?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsGroup({
  children,
  className,
  divided = true,
}: SettingsGroupProps) {
  return (
    <div
      className={cn(
        'divide-y divide-border',
        divided && 'divide-y divide-border',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default SettingsGroup;

