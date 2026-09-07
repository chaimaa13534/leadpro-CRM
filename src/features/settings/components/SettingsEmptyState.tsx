/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsEmptyState
   État vide réutilisable pour les sections Settings sans contenu.
   ═════════════════════════════════════════════════════════════════════ */

import type { LucideIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface SettingsEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: SettingsEmptyStateProps) {
  return (
    <div className={className}>
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={action}
      />
    </div>
  );
}

export default SettingsEmptyState;

