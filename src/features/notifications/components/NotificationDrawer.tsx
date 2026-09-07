/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationDrawer
   Mobile-friendly drawer for notification preview
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationList } from './NotificationList';
import { backdropVariants } from '@/lib/motion-variants';
import type { Notification } from '@/types/notification.types';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading: boolean;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationDrawer = memo(function NotificationDrawer({
  open,
  onClose,
  notifications,
  loading,
  unreadCount,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
}: NotificationDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-overlay md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-surface shadow-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-accent" />
                <span className="text-[15px] font-semibold text-text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-57px)] p-4">
              <NotificationList
                notifications={notifications.slice(0, 20)}
                loading={loading}
                error={null}
                page={1}
                totalPages={1}
                onPageChange={() => {}}
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

