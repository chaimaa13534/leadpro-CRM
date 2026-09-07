import { Badge } from '@/components/ui/Badge';
import { LEAD_SOURCES } from '@/lib/constants/statuses.constants';
import type { LeadSource } from '@/types/lead.types';

export interface LeadSourceBadgeProps {
  source: LeadSource;
}

/**
 * Badge de source — discret, sans pastille.
 * Simple tag d'information en fond neutre.
 */
export function LeadSourceBadge({ source }: LeadSourceBadgeProps) {
  return <Badge variant="neutral" dot={false}>{LEAD_SOURCES[source].label}</Badge>;
}
