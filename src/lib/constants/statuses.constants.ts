import type { LeadStatus, LeadSource, LeadPriority } from '@/types/lead.types';
import type { TaskStatus, TaskPriority } from '@/types/task.types';
import type { BadgeProps } from '@/components/ui/Badge';
import { COLORS } from '@/lib/constants/colors.constants';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export const LEAD_STATUSES: Record<
  LeadStatus,
  { label: string; color: string; badgeVariant: BadgeVariant }
> = {
  new: { label: 'Nouveau', color: COLORS.info[500], badgeVariant: 'info' },
  contacted: {
    label: 'Contacté',
    color: COLORS.primary[400],
    badgeVariant: 'neutral',
  },
  qualified: {
    label: 'Qualifié',
    color: COLORS.success[500],
    badgeVariant: 'success',
  },
  unqualified: {
    label: 'Non qualifié',
    color: COLORS.neutral[400],
    badgeVariant: 'neutral',
  },
  converted: {
    label: 'Converti',
    color: COLORS.primary[700],
    badgeVariant: 'success',
  },
};

export const LEAD_SOURCES: Record<LeadSource, { label: string }> = {
  website: { label: 'Site web' },
  referral: { label: 'Recommandation' },
  social_media: { label: 'Réseaux sociaux' },
  cold_call: { label: 'Appel à froid' },
  email_campaign: { label: 'Campagne email' },
  event: { label: 'Événement' },
  other: { label: 'Autre' },
};

export const LEAD_PRIORITIES: Record<
  LeadPriority,
  { label: string; color: string; badgeVariant: BadgeVariant }
> = {
  low: { label: 'Basse', color: COLORS.info[500], badgeVariant: 'info' },
  medium: {
    label: 'Moyenne',
    color: COLORS.warning[500],
    badgeVariant: 'warning',
  },
  high: { label: 'Haute', color: COLORS.danger[500], badgeVariant: 'danger' },
};

export const TASK_STATUSES: Record<
  TaskStatus,
  { label: string; color: string }
> = {
  todo: { label: 'À faire', color: COLORS.neutral[400] },
  in_progress: { label: 'En cours', color: COLORS.info[500] },
  done: { label: 'Terminée', color: COLORS.success[500] },
  cancelled: { label: 'Annulée', color: COLORS.danger[500] },
};

export const TASK_PRIORITIES: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  low: { label: 'Basse', color: COLORS.info[500] },
  medium: { label: 'Moyenne', color: COLORS.warning[500] },
  high: { label: 'Haute', color: COLORS.danger[500] },
  critical: { label: 'Critique', color: COLORS.danger[600] },
};
