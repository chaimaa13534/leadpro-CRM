import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants/routes.constants';

export interface SidebarHeaderProps {
  isCollapsed: boolean;
}

/**
 * Marque LeadPro CRM en tête de Sidebar. Le logo est un simple monogramme
 * en CSS (pas de fichier image à gérer aujourd'hui) — cohérent avec la
 * consigne de rester sobre.
 */
export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <Link
      to={ROUTES.DASHBOARD}
      className={cn(
        'flex h-16 shrink-0 items-center gap-2.5 px-5',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#6d7af0] text-sm font-bold text-white shadow-sm">
        L
      </span>
      <span
        className={cn('text-title text-text-primary', isCollapsed && 'sr-only')}
      >
        LeadPro CRM
      </span>
    </Link>
  );
}
