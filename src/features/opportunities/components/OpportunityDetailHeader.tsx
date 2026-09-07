import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { OpportunityStageBadge } from '@/features/opportunities/components/OpportunityStageBadge';
import { OpportunityPriorityBadge } from '@/features/opportunities/components/OpportunityPriorityBadge';
import { OpportunityStatusBadge } from '@/features/opportunities/components/OpportunityStatusBadge';
import { OpportunityQuickActions } from '@/features/opportunities/components/OpportunityQuickActions';
import { OpportunityTags } from '@/features/opportunities/components/OpportunityTags';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunityDetailHeaderProps {
  opportunity: Opportunity;
}

export function OpportunityDetailHeader({ opportunity }: OpportunityDetailHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-title font-semibold text-accent dark:bg-accent-muted">
          {getInitials(opportunity.name)}
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h3 text-text-primary">{opportunity.name}</h1>
          <p className="text-body text-text-secondary">
            {opportunity.companyName ?? 'Entreprise non renseignée'}
            {opportunity.contactName ? ` · ${opportunity.contactName}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <OpportunityStageBadge stage={opportunity.stage} />
            <OpportunityPriorityBadge priority={opportunity.priority} />
            <OpportunityStatusBadge status={opportunity.status} />
            {opportunity.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
            <span className="text-caption text-text-secondary">
              {formatCurrency(opportunity.amount, opportunity.currency)} ·
              Créée le {formatDate(opportunity.createdAt, 'medium')}
            </span>
          </div>
        </div>
      </div>

      <OpportunityQuickActions opportunity={opportunity} />
    </motion.div>
  );
}

