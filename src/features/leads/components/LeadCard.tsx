import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { LeadStatusBadge } from '@/features/leads/components/LeadStatusBadge';
import { LeadSourceBadge } from '@/features/leads/components/LeadSourceBadge';
import { LeadActions } from '@/features/leads/components/LeadActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Lead } from '@/types/lead.types';

export interface LeadCardProps {
  lead: Lead;
  index: number;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

/**
 * Carte de lead pour mobile — style "carte de visite" premium.
 * Design aéré, typographie claire, espacement généreux.
 */
export function LeadCard({
  lead,
  index,
  onView,
  onEdit,
  onDelete,
}: LeadCardProps) {
  const owner = usersMock.find((user) => user.id === lead.ownerId);
  const fullName = `${lead.firstName} ${lead.lastName}`;

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
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
                {getInitials(fullName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-body font-medium text-text-primary">
                  {fullName}
                </p>
                <p className="truncate text-caption text-text-secondary/70">
                  {lead.companyName ?? '—'}
                </p>
              </div>
            </div>
            <LeadActions
              leadName={fullName}
              onView={() => onView(lead)}
              onEdit={() => onEdit(lead)}
              onDelete={() => onDelete(lead)}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <LeadStatusBadge status={lead.status} />
            <LeadSourceBadge source={lead.source} />
          </div>

          <div className="border-t border-border/50" />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-caption">
            <dt className="text-text-secondary/70">Email</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {lead.email}
            </dd>
            <dt className="text-text-secondary/70">Téléphone</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {lead.phone ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Responsable</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
            </dd>
            <dt className="text-text-secondary/70">Créé le</dt>
            <dd className="text-figure truncate text-right font-medium text-text-primary">
              {formatDate(lead.createdAt, 'short')}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </motion.div>
  );
}
