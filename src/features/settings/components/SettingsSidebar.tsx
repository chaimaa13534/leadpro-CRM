/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsSidebar
   Navigation groupée (Personal / Workspace / System) avec icônes Lucide,
   état actif, hover et focus accessible.
   ═════════════════════════════════════════════════════════════════════ */

import { type LucideIcon } from 'lucide-react';
import {
  User,
  UserCircle,
  Building2,
  Palette,
  Bell,
  ShieldCheck,
  Users,
  KeyRound,
  Puzzle,
  Database,
  CreditCard,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants/routes.constants';

interface SettingsNavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SettingsNavGroup {
  title: string;
  items: SettingsNavItem[];
}

/** Sections groupées de la navigation des réglages. */
export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    title: 'Général',
    items: [
      { label: 'General', icon: Settings, path: ROUTES.SETTINGS_GENERAL },
    ],
  },
  {
    title: 'Personal',
    items: [
      { label: 'Profile', icon: User, path: ROUTES.SETTINGS_PROFILE },
      { label: 'Account', icon: UserCircle, path: ROUTES.SETTINGS_ACCOUNT },
      { label: 'Appearance', icon: Palette, path: ROUTES.SETTINGS_APPEARANCE },
      { label: 'Notifications', icon: Bell, path: ROUTES.SETTINGS_NOTIFICATIONS },
      { label: 'Security', icon: ShieldCheck, path: ROUTES.SETTINGS_SECURITY },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { label: 'Organization', icon: Building2, path: ROUTES.SETTINGS_ORGANIZATION },
      { label: 'Team', icon: Users, path: ROUTES.SETTINGS_TEAM },
      { label: 'Roles & Permissions', icon: KeyRound, path: ROUTES.SETTINGS_ROLES },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Integrations', icon: Puzzle, path: ROUTES.SETTINGS_INTEGRATIONS },
      { label: 'Data & Privacy', icon: Database, path: ROUTES.SETTINGS_PRIVACY },
      { label: 'Billing', icon: CreditCard, path: ROUTES.SETTINGS_BILLING },
      { label: 'Advanced', icon: SlidersHorizontal, path: ROUTES.SETTINGS_ADVANCED },
    ],
  },
];

interface SettingsSidebarProps {
  onNavigate?: () => void;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsSidebar({ onNavigate }: SettingsSidebarProps) {
  return (
    <nav className="flex flex-col gap-5" aria-label="Réglages">
      {SETTINGS_NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
            {group.title}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-accent-subtle text-accent shadow-sm before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-accent'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors duration-150',
                          isActive
                            ? 'text-accent'
                            : 'text-text-tertiary group-hover:text-text-secondary',
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default SettingsSidebar;

