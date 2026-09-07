import type { ID, ISODateString } from '@/types/common.types';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'mention'
  | 'task_reminder'
  | 'lead_created'
  | 'lead_updated'
  | 'contact_created'
  | 'company_created'
  | 'opportunity_created'
  | 'pipeline_moved'
  | 'meeting_scheduled'
  | 'task_assigned'
  | 'report_generated'
  | 'user_login'
  | 'comment'
  | 'system_alert';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationModule =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'opportunities'
  | 'pipeline'
  | 'tasks'
  | 'meetings'
  | 'reports'
  | 'system'
  | 'mentions';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id: ID;
  recipientId: ID;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  status: NotificationStatus;
  priority: NotificationPriority;
  module: NotificationModule;
  authorId: ID;
  authorName: string;
  authorAvatarUrl?: string;
  linkTo?: string;
  relatedEntityId?: ID;
  relatedEntityName?: string;
  createdAt: ISODateString;
  readAt?: ISODateString;
  archivedAt?: ISODateString;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sms: boolean;
  lead: boolean;
  pipeline: boolean;
  tasks: boolean;
  meetings: boolean;
  reports: boolean;
  marketing: boolean;
  mentions: boolean;
  systemAlerts: boolean;
  digestFrequency: 'instant' | 'daily' | 'weekly';
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface NotificationFilter {
  type: NotificationType | 'all';
  module: NotificationModule | 'all';
  priority: NotificationPriority | 'all';
  status: NotificationStatus | 'all';
  userId: ID | 'all';
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
  searchQuery: string;
}

export const NOTIFICATION_PRIORITIES: NotificationPriority[] = [
  'low',
  'normal',
  'high',
  'urgent',
];

export const NOTIFICATION_MODULES: NotificationModule[] = [
  'leads',
  'contacts',
  'companies',
  'opportunities',
  'pipeline',
  'tasks',
  'meetings',
  'reports',
  'system',
  'mentions',
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  'info',
  'success',
  'warning',
  'error',
  'mention',
  'task_reminder',
  'lead_created',
  'lead_updated',
  'contact_created',
  'company_created',
  'opportunity_created',
  'pipeline_moved',
  'meeting_scheduled',
  'task_assigned',
  'report_generated',
  'user_login',
  'comment',
  'system_alert',
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: true,
  push: true,
  desktop: true,
  sms: false,
  lead: true,
  pipeline: true,
  tasks: true,
  meetings: true,
  reports: true,
  marketing: false,
  mentions: true,
  systemAlerts: true,
  digestFrequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};
