import { cn } from '@/lib/cn';
import { Icons } from '@/components/ui/icons';

export interface SidebarFooterProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * Bas de Sidebar : uniquement le bouton réduire/agrandir aujourd'hui.
 * Emplacement naturel pour un futur résumé utilisateur (avatar mini),
 * non développé aujourd'hui (pas d'authentification).
 */
export function SidebarFooter({
  isCollapsed,
  onToggleCollapsed,
}: SidebarFooterProps) {
  return (
    <div className="shrink-0 border-t border-border p-2">
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}
        aria-pressed={isCollapsed}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-body text-text-secondary transition-colors duration-150 ease-standard hover:bg-muted hover:text-text-primary',
          isCollapsed && 'justify-center px-0',
        )}
      >
        <Icons.chevronLeft
          className={cn(
            'size-[18px] shrink-0 transition-transform duration-200 ease-standard',
            isCollapsed && 'rotate-180',
          )}
          aria-hidden="true"
        />
        <span className={cn(isCollapsed && 'sr-only')}>Réduire</span>
      </button>
    </div>
  );
}
