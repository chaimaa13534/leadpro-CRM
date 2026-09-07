import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import type { NavItem } from '@/lib/constants/navigation.constants';

export interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  /** Ferme le drawer mobile au clic — non utilisé sur la Sidebar desktop. */
  onNavigate?: () => void;
}

/**
 * Un lien de navigation, partagé par `Sidebar` (desktop/tablette) et
 * `MobileDrawer` (mobile) via la même liste `MAIN_NAV_ITEMS`.
 *
 * L'état actif vient de `NavLink` (`react-router`), pas d'une comparaison
 * manuelle de route — il reste donc correct même si la structure des
 * routes évolue.
 */
export function SidebarItem({
  item,
  isCollapsed,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <li className="group/item relative">
      <NavLink
        to={item.path}
        end={item.path === '/'}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-body transition-all duration-150 ease-standard',
            isCollapsed && 'justify-center px-0',
            isActive
              ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
              : 'text-text-secondary hover:bg-muted hover:text-text-primary',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'absolute top-1/2 left-0 h-[18px] w-[3px] -translate-y-1/2 rounded-full bg-primary-600 transition-all duration-200 ease-standard',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden="true"
            />
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span className={cn(isCollapsed && 'sr-only')}>{item.label}</span>
          </>
        )}
      </NavLink>

      {isCollapsed ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute top-1/2 left-full z-(--z-tooltip) ml-2 -translate-y-1/2 rounded-md bg-neutral-900 px-2 py-1 text-caption whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/item:opacity-100 dark:bg-neutral-700"
        >
          {item.label}
        </span>
      ) : null}
    </li>
  );
}
