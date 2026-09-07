import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
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

export interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
}

export function OpportunityCard({
  opportunity,
  index,
  onView,
  onEdit,
  onDelete,
}: OpportunityCardProps) {
  const owner = usersMock.find((user) => user.id === opportunity.ownerId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
    >
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-caption font-semibold text-accent dark:bg-accent-muted">
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
            <OpportunityActions
              opportunityName={opportunity.name}
              onView={() => onView(opportunity)}
              onEdit={() => onEdit(opportunity)}
              onDelete={() => onDelete(opportunity)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <OpportunityStageBadge stage={opportunity.stage} />
            <OpportunityPriorityBadge priority={opportunity.priority} />
            <OpportunityStatusBadge status={opportunity.status} />
          </div>

          <div className="flex items-center gap-3">
            <Progress value={opportunity.probability} size="sm" variant="accent" className="flex-1" />
            <span className="text-caption tabular-nums text-text-secondary/70">
              {opportunity.probability}%
            </span>
          </div>

          <div className="border-t border-border/50" />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-caption">
            <dt className="text-text-secondary/70">Valeur</dt>
            <dd className="text-right font-medium tabular-nums text-text-primary">
              {formatCurrency(opportunity.amount, opportunity.currency)}
            </dd>
            <dt className="text-text-secondary/70">Contact</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {opportunity.contactName ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Commercial</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
            </dd>
            <dt className="text-text-secondary/70">Clôture</dt>
            <dd className="text-right tabular-nums font-medium text-text-primary">
              {opportunity.expectedCloseDate
                ? formatDate(opportunity.expectedCloseDate, 'short')
                : '—'}
            </dd>
            <dt className="text-text-secondary/70">Dernière activité</dt>
            <dd className="text-right tabular-nums font-medium text-text-primary">
              {opportunity.lastActivityAt
                ? formatDate(opportunity.lastActivityAt, 'short')
                : '—'}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </motion.div>
  );
}

