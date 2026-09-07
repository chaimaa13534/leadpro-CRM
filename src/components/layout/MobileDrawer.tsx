import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useLayout } from '@/hooks/useLayout';

/* ═══════════════════════════════════════════════════════ */
export function MobileDrawer() {
  const { drawerOpen, closeDrawer } = useLayout();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
          >
            <button
              onClick={closeDrawer}
              className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-text-tertiary shadow-sm transition-colors hover:bg-surface-hover hover:text-text-secondary"
              aria-label="Fermer le menu"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
