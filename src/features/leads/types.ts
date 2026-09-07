import type { ID, ISODateString } from '@/types/common.types';

/**
 * Types propres à la fiche détaillée d'un Lead. Volontairement locaux à
 * `features/leads/` plutôt que dans `types/` global : `LeadActivity` et
 * `TimelineEvent` sont conceptuellement proches de `Activity`
 * (`types/activity.types.ts`, fil d'activité du Dashboard) mais
 * représentent autre chose (les interactions propres à UN lead) — les
 * mélanger dans le même type global aurait créé de la confusion, pas de
 * la réutilisation.
 */

export type TimelineEventType =
  'created' | 'call' | 'email' | 'meeting' | 'note' | 'status_change';

export interface TimelineEvent {
  id: ID;
  leadId: ID;
  type: TimelineEventType;
  title: string;
  description?: string;
  actorName: string;
  occurredAt: ISODateString;
}

export type LeadActivityType = 'call' | 'email' | 'task' | 'meeting';

export interface LeadActivity {
  id: ID;
  leadId: ID;
  type: LeadActivityType;
  title: string;
  actorName: string;
  occurredAt: ISODateString;
  durationMinutes?: number;
}

export interface LeadNote {
  id: ID;
  leadId: ID;
  authorName: string;
  content: string;
  createdAt: ISODateString;
}

export type LeadDocumentType = 'pdf' | 'doc' | 'image' | 'other';

export interface LeadDocument {
  id: ID;
  leadId: ID;
  fileName: string;
  fileType: LeadDocumentType;
  fileSizeKb: number;
  uploadedBy: string;
  uploadedAt: ISODateString;
}
