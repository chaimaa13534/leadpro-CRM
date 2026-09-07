/* ═════════════════════════════════════════════════════════════════════
   Notifications & Activity Center — Service (simulated)
   ═════════════════════════════════════════════════════════════════════ */

import type {
  Notification,
  NotificationFilter,
  NotificationSettings,
  NotificationStatus,
} from '@/types/notification.types';

import type {
  Activity,
  ActivityFilter,
  ActivityGroup,
} from '@/types/activity.types';

import {
  notificationsMock,
  activitiesMock,
  defaultNotificationSettings,
} from '@/features/notifications/mocks/notifications.mock';

/* ── Simulate network delay ── */
function delay<T>(data: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/* ── Filter notifications ── */
function applyNotificationFilters(
  items: Notification[],
  filters: Partial<NotificationFilter>,
): Notification[] {
  let filtered = [...items];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((n) => n.type === filters.type);
  }
  if (filters.module && filters.module !== 'all') {
    filtered = filtered.filter((n) => n.module === filters.module);
  }
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter((n) => n.priority === filters.priority);
  }
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((n) => {
      if (filters.status === 'unread') return !n.isRead;
      if (filters.status === 'read') return n.isRead && n.status === 'read';
      if (filters.status === 'archived') return n.status === 'archived';
      return true;
    });
  }
  if (filters.userId && filters.userId !== 'all') {
    filtered = filtered.filter((n) => n.authorId === filters.userId);
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((n) => new Date(n.createdAt) >= new Date(filters.dateFrom!));
  }
  if (filters.dateTo) {
    filtered = filtered.filter((n) => new Date(n.createdAt) <= new Date(filters.dateTo!));
  }
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.authorName.toLowerCase().includes(q) ||
        (n.relatedEntityName?.toLowerCase().includes(q) ?? false),
    );
  }

  return filtered;
}

/* ── Get all notifications ── */
export async function getNotifications(
  filters?: Partial<NotificationFilter>,
  page = 1,
  pageSize = 50,
): Promise<{ items: Notification[]; total: number; page: number; totalPages: number }> {
  let items = filters ? applyNotificationFilters(notificationsMock, filters) : [...notificationsMock];
  const total = items.length;

  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return delay({
    items: paginated,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

/* ── Get unread count ── */
export async function getUnreadCount(): Promise<number> {
  return delay(notificationsMock.filter((n) => !n.isRead).length);
}

/* ── Mark as read ── */
export async function markAsRead(notificationId: string): Promise<Notification> {
  const notif = notificationsMock.find((n) => n.id === notificationId);
  if (notif) {
    notif.isRead = true;
    notif.status = 'read';
    notif.readAt = new Date().toISOString();
  }
  return delay(notif ?? notificationsMock[0]!);
}

/* ── Mark all as read ── */
export async function markAllAsRead(): Promise<void> {
  const now = new Date().toISOString();
  notificationsMock.forEach((n) => {
    n.isRead = true;
    n.status = 'read';
    n.readAt = now;
  });
  return delay(undefined);
}

/* ── Mark as unread ── */
export async function markAsUnread(notificationId: string): Promise<Notification> {
  const notif = notificationsMock.find((n) => n.id === notificationId);
  if (notif) {
    notif.isRead = false;
    notif.status = 'unread';
    notif.readAt = undefined;
  }
  return delay(notif ?? notificationsMock[0]!);
}

/* ── Archive notification ── */
export async function archiveNotification(notificationId: string): Promise<Notification> {
  const notif = notificationsMock.find((n) => n.id === notificationId);
  if (notif) {
    notif.status = 'archived';
    notif.archivedAt = new Date().toISOString();
  }
  return delay(notif ?? notificationsMock[0]!);
}

/* ── Delete notification (simulated) ── */
export async function deleteNotification(notificationId: string): Promise<void> {
  const index = notificationsMock.findIndex((n) => n.id === notificationId);
  if (index !== -1) {
    notificationsMock.splice(index, 1);
  }
  return delay(undefined);
}

/* ── Get notification settings ── */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  return delay({ ...defaultNotificationSettings });
}

/* ── Update notification settings ── */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>,
): Promise<NotificationSettings> {
  Object.assign(defaultNotificationSettings, settings);
  return delay({ ...defaultNotificationSettings });
}

/* ════════════════════════════════════════════════════════
   Activity Service
   ════════════════════════════════════════════════════════ */

/* ── Filter activities ── */
function applyActivityFilters(
  items: Activity[],
  filters: Partial<ActivityFilter>,
): Activity[] {
  let filtered = [...items];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((a) => a.type === filters.type);
  }
  if (filters.module && filters.module !== 'all') {
    filtered = filtered.filter((a) => a.module === filters.module);
  }
  if (filters.actorId && filters.actorId !== 'all') {
    filtered = filtered.filter((a) => a.actorId === filters.actorId);
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((a) => new Date(a.occurredAt) >= new Date(filters.dateFrom!));
  }
  if (filters.dateTo) {
    filtered = filtered.filter((a) => new Date(a.occurredAt) <= new Date(filters.dateTo!));
  }
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.description.toLowerCase().includes(q) ||
        a.actorName.toLowerCase().includes(q) ||
        (a.relatedEntityName?.toLowerCase().includes(q) ?? false),
    );
  }

  return filtered;
}

/* ── Get all activities ── */
export async function getActivities(
  filters?: Partial<ActivityFilter>,
  page = 1,
  pageSize = 30,
): Promise<{ items: Activity[]; total: number; page: number; totalPages: number }> {
  let items = filters ? applyActivityFilters(activitiesMock, filters) : [...activitiesMock];
  const total = items.length;

  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return delay({
    items: paginated,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

/* ── Get activity groups (grouped by date) ── */
function groupActivitiesByDate(activities: Activity[]): ActivityGroup[] {
  const groups = new Map<string, Activity[]>();

  for (const activity of activities) {
    const date = new Date(activity.occurredAt);
    const dateKey = date.toISOString().split('T')[0]!;
    const existing = groups.get(dateKey) ?? [];
    existing.push(activity);
    groups.set(dateKey, existing);
  }

  const now = new Date();
  const todayKey = now.toISOString().split('T')[0]!;
  const yesterdayKey = new Date(now.getTime() - 86400000).toISOString().split('T')[0]!;

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, acts]) => {
      let label: string;
      if (date === todayKey) label = "Aujourd'hui";
      else if (date === yesterdayKey) label = 'Hier';
      else {
        const d = new Date(date);
        label = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        }).format(d);
      }
      return { date, label, activities: acts };
    });
}

export async function getActivityGroups(
  filters?: Partial<ActivityFilter>,
  page = 1,
  pageSize = 30,
): Promise<{ groups: ActivityGroup[]; total: number; page: number; totalPages: number }> {
  let items = filters ? applyActivityFilters(activitiesMock, filters) : [...activitiesMock];
  const total = items.length;

  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);
  const groups = groupActivitiesByDate(paginated);

  return delay({
    groups,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

