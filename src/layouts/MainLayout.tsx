import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { useLayout } from '@/hooks/useLayout';
import { cn } from '@/lib/cn';

/* ═══════════════════════════════════════════════════════
   MainLayout — Application authentifiée
   ═══════════════════════════════════════════════════════ */
export function MainLayout() {
  const { collapsed } = useLayout();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer />

      {/* Main content area */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          collapsed ? 'lg:pl-[68px]' : 'lg:pl-[260px]'
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
