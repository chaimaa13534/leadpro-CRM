/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationList
   Virtualized list with loading, empty state, and pagination
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { NotificationCard } from '@/features/notifications/components/NotificationCard';
import { staggerContainer } from '@/lib/motion-variants';
import type { Notification } from '@/types/notification.types';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen?: (notification: Notification) => void;
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
      <Skeleton className="size-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export const NotificationList = memo(function NotificationList({
  notifications,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onOpen,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-3" role="list" aria-label="Chargement des notifications">
        {Array.from({ length: 6 }).map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Bell}
        title="Erreur de chargement"
        description={error}
        action={{ label: 'Réessayer', onClick: () => window.location.reload() }}
      />
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Aucune notification"
        description="Vous n'avez aucune notification pour le moment. Les nouvelles notifications apparaîtront ici."
      />
    );
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-2"
        role="list"
        aria-label="Liste des notifications"
      >
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onMarkAsUnread={onMarkAsUnread}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
});

