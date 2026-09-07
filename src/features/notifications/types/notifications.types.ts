/* ═════════════════════════════════════════════════════════════════════
   Notifications & Activity Center — Feature Types
   Re-exports base types and adds feature-specific types
   ═════════════════════════════════════════════════════════════════════ */

export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationModule,
  NotificationStatus,
  NotificationSettings,
  NotificationFilter,
} from '@/types/notification.types';

export {
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_MODULES,
  NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/types/notification.types';

export type {
  Activity,
  ActivityType,
  ActivityModule,
  ActivityGroup,
  ActivityFilter,
} from '@/types/activity.types';

export {
  ACTIVITY_TYPES,
  ACTIVITY_MODULES,
} from '@/types/activity.types';

/* ── Feature-specific helpers ── */

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
  mentions: number;
  alerts: number;
  crmActivities: number;
}

export interface ActivityStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byModule: Record<string, number>;
  byType: Record<string, number>;
}
