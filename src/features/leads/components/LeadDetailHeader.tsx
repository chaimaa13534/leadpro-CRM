import { motion } from 'framer-motion';
import { LeadStatusBadge } from '@/features/leads/components/LeadStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { LeadQuickActions } from '@/features/leads/components/LeadQuickActions';
import { LEAD_PRIORITIES } from '@/lib/constants/statuses.constants';
import { getInitials } from '@/utils/getInitials';
import { formatDate } from '@/utils/formatDate';
import type { Lead } from '@/types/lead.types';

export interface LeadDetailHeaderProps {
  lead: Lead;
}

/**
 * En-tête de la fiche Lead. Nommé `LeadDetailHeader` plutôt que
 * `LeadHeader` (nom demandé par le brief) pour éviter une collision avec
 * `features/leads/forms/LeadHeader` (Jour 9, en-tête de la page "Nouveau
 * Lead") — même logique que le renommage de `LeadActions` en
 * `LeadFormActions` la veille.
 */
export function LeadDetailHeader({ lead }: LeadDetailHeaderProps) {
  const fullName = `${lead.firstName} ${lead.lastName}`;
  const priority = LEAD_PRIORITIES[lead.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-title font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          {getInitials(fullName)}
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h3 text-text-primary">{fullName}</h1>
          <p className="text-body text-text-secondary">
            {lead.jobTitle ? `${lead.jobTitle} · ` : ''}
            {lead.companyName ?? 'Entreprise non renseignée'}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <LeadStatusBadge status={lead.status} />
            <Badge variant={priority.badgeVariant}>
              Priorité {priority.label.toLowerCase()}
            </Badge>
            <span className="text-caption text-text-secondary">
              Créé le {formatDate(lead.createdAt, 'medium')}
            </span>
          </div>
        </div>
      </div>

      <LeadQuickActions lead={lead} />
    </motion.div>
  );
}
