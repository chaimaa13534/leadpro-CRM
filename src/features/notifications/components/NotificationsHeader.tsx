/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationsHeader
   Header with actions: mark all read, delete, refresh
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  RefreshCw,
  Trash2,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface NotificationsHeaderProps {
  unreadCount: number;
  total: number;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  onDeleteAll?: () => void;
  onOpenSettings?: () => void;
  loading?: boolean;
}

export const NotificationsHeader = memo(function NotificationsHeader({
  unreadCount,
  total,
  onMarkAllRead,
  onRefresh,
  onDeleteAll,
  onOpenSettings,
  loading = false,
}: NotificationsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface-hover text-accent">
            <Bell className="size-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">
              Notifications
            </h1>
            <p className="mt-1 flex items-center gap-2 text-[13px] text-text-tertiary">
              Centre de notifications et d'activités
              {unreadCount > 0 && (
                <Badge variant="danger" size="sm">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-text-tertiary tabular-nums">
            {total} notification{total > 1 ? 's' : ''}
          </span>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              aria-label="Marquer tout comme lu"
            >
              <CheckCheck className="size-3.5" />
              <span className="hidden sm:inline">Tout marquer comme lu</span>
            </Button>
          )}

          {onDeleteAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteAll}
              aria-label="Supprimer toutes les notifications"
            >
              <Trash2 className="size-3.5" />
              <span className="hidden sm:inline">Tout supprimer</span>
            </Button>
          )}

          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              aria-label="Paramètres de notification"
            >
              <Settings className="size-3.5" />
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            loading={loading}
            aria-label="Actualiser"
          >
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-tertiary">
        <span className="rounded-full bg-accent-subtle px-2.5 py-1 text-accent">
          {unreadCount > 0
            ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} à lire`
            : 'Toutes les notifications sont lues'}
        </span>
        <span className="rounded-full bg-surface-hover px-2.5 py-1">
          Dernières activités CRM
        </span>
      </div>
    </motion.div>
  );
});

