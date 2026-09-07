import type { ID, ISODateString } from '@/types/common.types';

/* ── Calendar event types ── */

export type EventType = 'meeting' | 'call' | 'demo' | 'appointment' | 'reminder' | 'deadline' | 'lunch' | 'other';

export type EventPriority = 'low' | 'medium' | 'high' | 'critical';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

export type ReminderTime = '5min' | '10min' | '15min' | '30min' | '1hour' | '2hours' | '1day' | '2days';

export interface Participant {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  responseStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface EventDocument {
  id: ID;
  name: string;
  url: string;
  type: 'file' | 'link' | 'note';
  uploadedAt: ISODateString;
}

export interface EventHistoryEntry {
  id: ID;
  action: string;
  actorName: string;
  timestamp: ISODateString;
}

export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startTime: ISODateString;
  endTime?: ISODateString;
  allDay?: boolean;
  type: EventType;
  priority: EventPriority;
  color?: string;
  location?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  participants: Participant[];
  documents: EventDocument[];
  history: EventHistoryEntry[];
  notes?: string;
  reminder?: ReminderTime;
  companyId?: ID;
  companyName?: string;
  contactId?: ID;
  contactName?: string;
  opportunityId?: ID;
  opportunityName?: string;
  ownerId: ID;
  ownerName: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/* ── Calendar state ── */

export interface CalendarFilters {
  ownerId: ID | null;
  companyId: ID | null;
  contactId: ID | null;
  type: EventType | null;
  priority: EventPriority | null;
  searchQuery: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}

export interface CalendarKPI {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
  change?: number;
}

