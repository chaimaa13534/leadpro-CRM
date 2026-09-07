import type { LucideIcon } from 'lucide-react';
import { Icons } from '@/components/ui/icons';
import { ROUTES } from '@/lib/constants/routes.constants';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

/**
 * Source unique pour la navigation principale : consommée par `Sidebar`,
 * `MobileDrawer` (mêmes liens, deux présentations) et `Breadcrumb` (pour
 * résoudre le libellé d'un segment d'URL). Toute évolution du menu se
 * fait ici, jamais en dupliquant la liste dans un composant.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: Icons.dashboard },
  { label: 'Leads', path: ROUTES.LEADS, icon: Icons.leads },
  { label: 'Contacts', path: ROUTES.CONTACTS, icon: Icons.contacts },
  { label: 'Companies', path: ROUTES.COMPANIES, icon: Icons.companies },
  {
    label: 'Opportunities',
    path: ROUTES.OPPORTUNITIES,
    icon: Icons.opportunities,
  },
  { label: 'Pipeline', path: ROUTES.PIPELINE, icon: Icons.opportunities },
  { label: 'Tasks', path: ROUTES.TASKS, icon: Icons.checkCircle2 },
  { label: 'Calendar', path: ROUTES.CALENDAR, icon: Icons.calendar },
  { label: 'Reports', path: ROUTES.REPORTS, icon: Icons.reports },
  {
    label: 'Notifications',
    path: ROUTES.NOTIFICATIONS,
    icon: Icons.notifications,
  },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Icons.settings },
];
