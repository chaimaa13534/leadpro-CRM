/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsCard
   Carte de réglages, réutilise le design system `Card`.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface SettingsCardProps {
  children: ReactNode;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsCard({ children, className }: SettingsCardProps) {
  return (
    <Card
      variant="default"
      padding="none"
      className={cn('overflow-hidden', className)}
    >
      {children}
    </Card>
  );
}

export default SettingsCard;

