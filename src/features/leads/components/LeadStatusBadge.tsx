import { Badge } from '@/components/ui/Badge';
import { leadStatusMeta } from '../constants';
import type { LeadStatus } from '../types/lead-management.types';

/** The mock-only statuses (`unqualified`/`converted`) from the legacy
 * `src/types/lead.types.ts` are also accepted so the still-referenced legacy
 * components (LeadCard, LeadRow, LeadDetailHeader) keep compiling until they
 * are migrated to the managed module. */
type LegacyLeadStatus = 'unqualified' | 'converted';

interface LeadStatusBadgeProps {
  status: LeadStatus | LegacyLeadStatus;
}

/** Badge visuel pour le statut d'un lead, cohérent avec le design system. */
export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  // Legacy statuses (unqualified/converted) are not part of the DB ENUM;
  // fall back to a neutral badge so they still render acceptably.
  const meta =
    status === 'unqualified' || status === 'converted'
      ? leadStatusMeta('new')
      : leadStatusMeta(status);
  return (
    <Badge variant={meta.variant} dot>
      {meta.label}
    </Badge>
  );
}
