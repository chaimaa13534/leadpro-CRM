import type { LeadPriority, LeadStatus } from '../types/lead-management.types';

/** Label + badge variant mapping for each lead status (mirrors DB ENUM). */
export const LEAD_STATUS_OPTIONS: {
  value: LeadStatus;
  label: string;
  variant: 'info' | 'warning' | 'primary' | 'neutral' | 'success' | 'danger';
}[] = [
  { value: 'new', label: 'Nouveau', variant: 'info' },
  { value: 'contacted', label: 'Contacté', variant: 'warning' },
  { value: 'qualified', label: 'Qualifié', variant: 'primary' },
  { value: 'proposal', label: 'Proposition', variant: 'neutral' },
  { value: 'won', label: 'Gagné', variant: 'success' },
  { value: 'lost', label: 'Perdu', variant: 'danger' },
];

/** Priority options with label + badge variant. */
export const LEAD_PRIORITY_OPTIONS: {
  value: LeadPriority;
  label: string;
  variant: 'info' | 'warning' | 'danger' | 'neutral';
}[] = [
  { value: 'low', label: 'Basse', variant: 'info' },
  { value: 'medium', label: 'Moyenne', variant: 'warning' },
  { value: 'high', label: 'Haute', variant: 'danger' },
];

/** Convenience lookups for a single status/priority value. */
export function leadStatusMeta(status: LeadStatus) {
  return (
    LEAD_STATUS_OPTIONS.find((o) => o.value === status) ??
    (LEAD_STATUS_OPTIONS[0] as (typeof LEAD_STATUS_OPTIONS)[number])
  );
}

export function leadPriorityMeta(priority: LeadPriority) {
  return (
    LEAD_PRIORITY_OPTIONS.find((o) => o.value === priority) ??
    (LEAD_PRIORITY_OPTIONS[1] as (typeof LEAD_PRIORITY_OPTIONS)[number])
  );
}
