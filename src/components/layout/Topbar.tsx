import { Search, Moon, Sun, Plus, Command } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useTheme } from '@/hooks/useTheme';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants/routes.constants';
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useApiNotifications';

/* ═══════════════════════════════════════════════════════
   Topbar
   ═══════════════════════════════════════════════════════ */
export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { collapsed } = useLayout();
  const { user } = useAuth();
  const unreadNotifications = useUnreadNotificationsCount();
  const unreadCount = unreadNotifications.data?.count ?? 0;

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md transition-all duration-300',
        collapsed ? 'lg:pl-[84px]' : 'lg:pl-[276px]'
      )}
    >
      {/* ── Search ── */}
      <button
        className={cn(
          'flex flex-1 items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px] text-text-tertiary transition-all hover:border-border-hover hover:bg-background-secondary',
          'max-w-md'
        )}
        aria-label="Rechercher"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Rechercher...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] font-medium text-text-tertiary sm:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        {/* ── Theme toggle ── */}
        <TopbarButton
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </TopbarButton>

        {/* ── Notifications ── */}
        <Link
          to={ROUTES.NOTIFICATIONS}
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-all hover:bg-surface-hover hover:text-text-secondary"
        >
          <span className="sr-only">Notifications</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-4 text-white ring-2 ring-surface">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </Link>

        {/* ── Quick add ── */}
        <TopbarButton aria-label="Créer" className="hidden sm:flex">
          <Plus className="h-[18px] w-[18px]" />
        </TopbarButton>

        {/* ── Avatar ── */}
        <button
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle text-[13px] font-medium text-accent transition-all duration-150 hover:ring-2 hover:ring-accent/30"
          aria-label="Profil utilisateur"
        >
          <Avatar
            firstName={user?.firstName}
            lastName={user?.lastName}
            src={user?.avatarUrl}
            size="md"
          />
        </button>
      </div>
    </header>
  );
}

/* ── Topbar icon button ── */
function TopbarButton({
  children,
  className,
  badge,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { badge?: boolean }) {
  return (
    <button
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-all hover:bg-surface-hover hover:text-text-secondary',
        className
      )}
      {...props}
    >
      {children}
      {badge && (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-surface" />
      )}
    </button>
  );
}
