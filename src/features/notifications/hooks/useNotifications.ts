/* ═════════════════════════════════════════════════════════════════════
   Notifications — Hook
   ═════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import type {
  Notification,
  NotificationFilter,
} from '@/types/notification.types';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  archiveNotification,
  deleteNotification,
} from '@/features/notifications/services/notifications.service';
import { getNotificationStats } from '@/features/notifications/mocks/notifications.mock';
import type { NotificationStats } from '@/features/notifications/types/notifications.types';
import { useNotifications as useToastNotifications } from '@/hooks/useNotifications';

interface UseNotificationsReturn {
  notifications: Notification[];
  stats: NotificationStats;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  filters: Partial<NotificationFilter>;
  page: number;
  totalPages: number;
  total: number;
  setFilters: Dispatch<SetStateAction<Partial<NotificationFilter>>>;
  setPage: (page: number) => void;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
  handleMarkAsUnread: (id: string) => Promise<void>;
  handleArchive: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotificationCenter(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
    mentions: 0,
    alerts: 0,
    crmActivities: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<NotificationFilter>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { success, error: toastError } = useToastNotifications();
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getNotifications(filters, page, 50);
      if (mountedRef.current) {
        setNotifications(result.items);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError('Erreur lors du chargement des notifications');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      if (mountedRef.current) {
        setUnreadCount(count);
        // Dynamically import stats from mock
        const { notificationsMock: notifs, getNotificationStats: statsFn } = await import(
          '@/features/notifications/mocks/notifications.mock'
        );
        if (mountedRef.current) {
          setStats(statsFn(notifs));
        }
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchNotifications();
    fetchStats();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchNotifications, fetchStats]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: true, status: 'read' as const, readAt: new Date().toISOString() } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        toastError('Erreur lors du marquage de la notification');
      }
    },
    [toastError],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
          status: 'read' as const,
          readAt: new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
      success('Toutes les notifications ont été marquées comme lues');
    } catch {
      toastError('Erreur lors du marquage de toutes les notifications');
    }
  }, [success, toastError]);

  const handleMarkAsUnread = useCallback(
    async (id: string) => {
      try {
        await markAsUnread(id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: false, status: 'unread' as const, readAt: undefined } : n,
          ),
        );
        setUnreadCount((prev) => prev + 1);
      } catch {
        toastError("Erreur lors du marquage de la notification comme non lue");
      }
    },
    [toastError],
  );

  const handleArchive = useCallback(
    async (id: string) => {
      try {
        await archiveNotification(id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, status: 'archived' as const, archivedAt: new Date().toISOString() } : n,
          ),
        );
        success('Notification archivée');
      } catch {
        toastError("Erreur lors de l'archivage de la notification");
      }
    },
    [success, toastError],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setTotal((prev) => prev - 1);
        success('Notification supprimée');
      } catch {
        toastError('Erreur lors de la suppression de la notification');
      }
    },
    [success, toastError],
  );

  const refresh = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchStats()]);
    success('Notifications actualisées');
  }, [fetchNotifications, fetchStats, success]);

  return useMemo(
    () => ({
      notifications,
      stats,
      unreadCount,
      loading,
      error,
      filters,
      page,
      totalPages,
      total,
      setFilters,
      setPage,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleMarkAsUnread,
      handleArchive,
      handleDelete,
      refresh,
    }),
    [
      notifications,
      stats,
      unreadCount,
      loading,
      error,
      filters,
      page,
      totalPages,
      total,
      setFilters,
      setPage,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleMarkAsUnread,
      handleArchive,
      handleDelete,
      refresh,
    ],
  );
}

