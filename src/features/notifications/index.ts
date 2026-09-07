/* ═════════════════════════════════════════════════════════════════════
   Notifications & Activity Center — Barrel
   ═════════════════════════════════════════════════════════════════════ */

// Types
export * from '@/features/notifications/types/notifications.types';

// Mocks
export { notificationsMock, activitiesMock, getNotificationStats, getActivityStats, defaultNotificationSettings } from '@/features/notifications/mocks/notifications.mock';

// Services
export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  archiveNotification,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  getActivities,
  getActivityGroups,
} from '@/features/notifications/services/notifications.service';

// Hooks
export { useNotificationCenter } from '@/features/notifications/hooks/useNotifications';
export { useNotifications as useApiNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '@/features/notifications/hooks/useApiNotifications';
export { useActivities } from '@/features/notifications/hooks/useActivities';

// Components
export { NotificationsHeader } from '@/features/notifications/components/NotificationsHeader';
export { NotificationsKPI } from '@/features/notifications/components/NotificationsKPI';
export { NotificationCard } from '@/features/notifications/components/NotificationCard';
export { NotificationList } from '@/features/notifications/components/NotificationList';
export { NotificationFilters } from '@/features/notifications/components/NotificationFilters';
export { NotificationSearch } from '@/features/notifications/components/NotificationSearch';
export { NotificationBadge } from '@/features/notifications/components/NotificationBadge';
export { NotificationDrawer } from '@/features/notifications/components/NotificationDrawer';
export { NotificationSettings } from '@/features/notifications/components/NotificationSettings';
export { ActivityTimeline } from '@/features/notifications/components/ActivityTimeline';
export { ActivityItem } from '@/features/notifications/components/ActivityItem';
export { ActivityFilters } from '@/features/notifications/components/ActivityFilters';
export { ActivitySearch } from '@/features/notifications/components/ActivitySearch';
export { ActivitySidebar } from '@/features/notifications/components/ActivitySidebar';
export { TimelineCard } from '@/features/notifications/components/TimelineCard';
export { TimelineGroup } from '@/features/notifications/components/TimelineGroup';
export { TimelineDate } from '@/features/notifications/components/TimelineDate';

// Pages
export { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
export { ActivityCenterPage } from '@/features/notifications/pages/ActivityCenterPage';
