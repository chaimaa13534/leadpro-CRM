/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsLayout
   Deux colonnes : sidebar de navigation (desktop) + contenu.
   Sur mobile, la sidebar devient un drawer avec un select de secours.
   ═════════════════════════════════════════════════════════════════════ */

import { useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { SettingsSidebar } from '@/features/settings/components/SettingsSidebar';
import { cn } from '@/lib/cn';
import { fadeVariants } from '@/lib/motion-variants';

/* ═══════════════════════════════════════════════════════ */
export function SettingsLayout() {
  return (
    <div className="mx-auto w-full max-w-3xl py-2 sm:py-6">
      <Outlet />
    </div>
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Mobile header */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          <h1 className="text-[18px] font-semibold tracking-tight text-text-primary">
            Settings
          </h1>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          aria-label="Ouvrir le menu des réglages"
        >
          Menu
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
            <SettingsSidebar />
          </div>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-surface p-4 lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation des réglages"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-text-primary">
                    Settings
                  </span>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-secondary"
                    aria-label="Fermer le menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SettingsSidebar onNavigate={() => setDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn('flex flex-col gap-6')}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
