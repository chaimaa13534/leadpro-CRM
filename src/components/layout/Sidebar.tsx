import { type LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Kanban,
  Users,
  Building2,
  Target,
  BarChart3,
  CalendarDays,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils';
import { ROUTES } from '@/lib/constants/routes.constants';


/* ── Types ── */
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* ── Navigation config ── */
const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Pipeline', icon: Kanban, path: '/pipeline' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Leads', icon: Target, path: '/leads' },
      { label: 'Contacts', icon: Users, path: '/contacts' },
      { label: 'Entreprises', icon: Building2, path: '/companies' },
      { label: 'Opportunities', icon: BarChart3, path: '/opportunities' },
      { label: 'Calendrier', icon: CalendarDays, path: '/calendar' },
      { label: 'Reports', icon: BarChart3, path: '/reports' },
],
},
{
title: 'System',
items: [
{ label: 'Users', icon: Users, path: ROUTES.USERS, adminOnly: true },
{ label: 'Settings', icon: Settings, path: '/settings' },
],
},
];

/* ═══════════════════════════════════════════════════════
Sidebar
═══════════════════════════════════════════════════════ */
export function Sidebar() {
  const layout = useLayout();
  const collapsed = (layout as { collapsed?: boolean }).collapsed ?? false;
  const toggleCollapsed = (layout as { toggleCollapsed?: () => void }).toggleCollapsed ?? (() => undefined);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

return (
<aside
className={cn(
'fixed inset-y-0 left-0 z-30 flex flex-col border-r transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
'bg-surface border-border',
collapsed ? 'w-[68px]' : 'w-[260px]'
)}
>
{/* ── Logo ── */}
<div
className={cn(
'flex h-14 shrink-0 items-center border-b border-border px-4',
collapsed ? 'justify-center' : 'gap-3'
)}
>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#6d7af0] shadow-sm">
<Sparkles className="h-4 w-4 text-white" />
</div>
{!collapsed && (
<span className="text-[15px] font-semibold tracking-tight text-text-primary">
LeadPro
</span>
)}
</div>

{/* ── Navigation ── */}
<nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
{NAV_SECTIONS.map((section) => (
<div key={section.title} className="mb-6 last:mb-0">
{!collapsed && (
<h3 className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
{section.title}
</h3>
)}
<ul className="flex flex-col gap-0.5">
{section.items
  .filter((item) => !item.adminOnly || isAdmin)
  .map((item) => (
    <li key={item.path}>
      <SidebarLink item={item} collapsed={collapsed} />
    </li>
  ))}
</ul>
</div>
))}
</nav>

{/* ── User section ── */}
<div className="shrink-0 border-t border-border p-3">
{!collapsed ? (
<div className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-hover">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-[13px] font-medium text-accent">
{user ? getInitials(`${user.firstName} ${user.lastName}`) : '—'}
</div>
<div className="flex-1 min-w-0">
<p className="truncate text-[13px] font-medium text-text-primary">
{user ? `${user.firstName} ${user.lastName}` : 'User'}
</p>
<p className="truncate text-[11px] text-text-tertiary">
{user?.email ?? ''}
</p>
</div>
<button
onClick={logout}
className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-active hover:text-text-secondary"
aria-label="Se déconnecter"
>
<LogOut className="h-4 w-4" />
</button>
</div>
) : (
<div className="flex flex-col items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle text-[13px] font-medium text-accent">
{user ? getInitials(`${user.firstName} ${user.lastName}`) : '—'}
</div>
<button
onClick={logout}
className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-active hover:text-text-secondary"
aria-label="Se déconnecter"
>
<LogOut className="h-4 w-4" />
</button>
</div>
)}
</div>

{/* ── Collapse toggle ── */}
<button
  onClick={toggleCollapsed}
  className="absolute -right-3 top-16 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface shadow-md transition-all duration-200 hover:scale-105 hover:bg-surface-hover"
  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
>
  {collapsed ? (
    <PanelLeftOpen className="h-4 w-4 text-text-secondary" />
  ) : (
    <PanelLeftClose className="h-4 w-4 text-text-secondary" />
  )}
</button>
</aside>
);
}

/* ═══════════════════════════════════════════════════════
SidebarLink
═══════════════════════════════════════════════════════ */
function SidebarLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-accent-subtle text-accent shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-full before:bg-accent"
            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-5 w-5 shrink-0 transition-colors duration-150",
              isActive
                ? "text-accent"
                : "text-text-tertiary group-hover:text-text-secondary"
            )}
          />

          {!collapsed && <span>{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}
