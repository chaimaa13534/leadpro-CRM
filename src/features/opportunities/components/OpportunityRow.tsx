import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/Progress';
import { OpportunityStageBadge } from '@/features/opportunities/components/OpportunityStageBadge';
import { OpportunityStatusBadge } from '@/features/opportunities/components/OpportunityStatusBadge';
import { OpportunityPriorityBadge } from '@/features/opportunities/components/OpportunityPriorityBadge';
import { OpportunityActions } from '@/features/opportunities/components/OpportunityActions';
import { usersMock } from '@/mocks/users.mock';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunityRowProps {
  opportunity: Opportunity;
  index: number;
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
}

export function OpportunityRow({
  opportunity,
  index,
  onView,
  onEdit,
  onDelete,
}: OpportunityRowProps) {
  const owner = usersMock.find((user) => user.id === opportunity.ownerId);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
      className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-muted/60"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-caption font-semibold text-accent dark:bg-accent-muted">
            {getInitials(opportunity.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-body font-medium text-text-primary">
              {opportunity.name}
            </p>
            <p className="truncate text-caption text-text-secondary/70">
              {opportunity.companyName ?? '—'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {opportunity.contactName ?? '—'}
      </td>
      <td className="px-3 py-4">
        {owner ? (
          <div className="flex items-center gap-2 text-body text-text-secondary/80">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-text-secondary">
              {getInitials(`${owner.firstName} ${owner.lastName}`)}
            </span>
            <span className="truncate">
              {owner.firstName} {owner.lastName}
            </span>
          </div>
        ) : (
          <span className="text-text-secondary/60">—</span>
        )}
      </td>
      <td className="px-3 py-4 text-body tabular-nums font-medium text-text-primary">
        {formatCurrency(opportunity.amount, opportunity.currency)}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <Progress value={opportunity.probability} size="sm" variant="accent" className="w-16" />
          <span className="text-caption tabular-nums text-text-secondary/70">
            {opportunity.probability}%
          </span>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-1.5">
          <OpportunityStageBadge stage={opportunity.stage} />
          <OpportunityPriorityBadge priority={opportunity.priority} />
        </div>
      </td>
      <td className="px-3 py-4 text-caption tabular-nums text-text-secondary/70">
        {opportunity.expectedCloseDate
          ? formatDate(opportunity.expectedCloseDate, 'short')
          : '—'}
      </td>
      <td className="px-3 py-4 text-caption text-text-secondary/70">
        {opportunity.lastActivityAt
          ? formatDate(opportunity.lastActivityAt, 'short')
          : '—'}
      </td>
      <td className="px-3 py-4">
        <OpportunityStatusBadge status={opportunity.status} />
      </td>
      <td className="px-3 py-4 text-right">
        <OpportunityActions
          opportunityName={opportunity.name}
          onView={() => onView(opportunity)}
          onEdit={() => onEdit(opportunity)}
          onDelete={() => onDelete(opportunity)}
        />
      </td>
    </motion.tr>
  );
}

