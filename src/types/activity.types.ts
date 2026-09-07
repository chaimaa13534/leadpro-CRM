import type { ID, ISODateString } from '@/types/common.types';

export type ActivityType =
  | 'lead_created'
  | 'lead_updated'
  | 'lead_deleted'
  | 'contact_created'
  | 'contact_updated'
  | 'contact_deleted'
  | 'company_created'
  | 'company_updated'
  | 'company_deleted'
  | 'opportunity_created'
  | 'opportunity_updated'
  | 'opportunity_deleted'
  | 'opportunity_won'
  | 'opportunity_lost'
  | 'pipeline_moved'
  | 'meeting_scheduled'
  | 'meeting_completed'
  | 'meeting_cancelled'
  | 'task_created'
  | 'task_completed'
  | 'task_updated'
  | 'comment_added'
  | 'note_added'
  | 'user_login'
  | 'user_logout'
  | 'report_generated'
  | 'email_sent'
  | 'call_made';

export type ActivityModule =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'opportunities'
  | 'pipeline'
  | 'tasks'
  | 'meetings'
  | 'reports'
  | 'communications';

export interface Activity {
  id: ID;
  type: ActivityType;
  module: ActivityModule;
  actorId: ID;
  actorName: string;
  actorAvatarUrl?: string;
  actorRole?: string;
  description: string;
  details?: string;
  relatedEntityId?: ID;
  relatedEntityName?: string;
  relatedEntityType?: string;
  linkTo?: string;
  metadata?: Record<string, string>;
  occurredAt: ISODateString;
}

export interface ActivityGroup {
  date: string;
  label: string;
  activities: Activity[];
}

export interface ActivityFilter {
  type: ActivityType | 'all';
  module: ActivityModule | 'all';
  actorId: ID | 'all';
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
  searchQuery: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  'lead_created',
  'lead_updated',
  'lead_deleted',
  'contact_created',
  'contact_updated',
  'contact_deleted',
  'company_created',
  'company_updated',
  'company_deleted',
  'opportunity_created',
  'opportunity_updated',
  'opportunity_deleted',
  'opportunity_won',
  'opportunity_lost',
  'pipeline_moved',
  'meeting_scheduled',
  'meeting_completed',
  'meeting_cancelled',
  'task_created',
  'task_completed',
  'task_updated',
  'comment_added',
  'note_added',
  'user_login',
  'user_logout',
  'report_generated',
  'email_sent',
  'call_made',
];

export const ACTIVITY_MODULES: ActivityModule[] = [
  'leads',
  'contacts',
  'companies',
  'opportunities',
  'pipeline',
  'tasks',
  'meetings',
  'reports',
  'communications',
];
