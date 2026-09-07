import { motion } from 'framer-motion';
import { LeadStatusBadge } from '@/features/leads/components/LeadStatusBadge';
import { LeadSourceBadge } from '@/features/leads/components/LeadSourceBadge';
import { LeadActions } from '@/features/leads/components/LeadActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Lead } from '@/types/lead.types';

export interface LeadRowProps {
  lead: Lead;
  index: number;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

/**
 * Ligne de tableau — design aéré premium.
 * Avatar + nom en première cellule, espacement généreux,
 * hover subtil, animations d'apparition différées par index.
 */
export function LeadRow({
  lead,
  index,
  onView,
  onEdit,
  onDelete,
}: LeadRowProps) {
  const owner = usersMock.find((user) => user.id === lead.ownerId);
  const fullName = `${lead.firstName} ${lead.lastName}`;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
      className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-muted/60"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
            {getInitials(fullName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-body font-medium text-text-primary">
              {fullName}
            </p>
            <p className="truncate text-caption text-text-secondary/70">
              {lead.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {lead.companyName ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {lead.phone ?? '—'}
      </td>
      <td className="px-3 py-4">
        <LeadSourceBadge source={lead.source} />
      </td>
      <td className="px-3 py-4">
        <LeadStatusBadge status={lead.status} />
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
      <td className="text-figure whitespace-nowrap px-3 py-4 text-caption text-text-secondary/70">
        {formatDate(lead.createdAt, 'short')}
      </td>
      <td className="px-3 py-4 text-right">
        <LeadActions
          leadName={fullName}
          onView={() => onView(lead)}
          onEdit={() => onEdit(lead)}
          onDelete={() => onDelete(lead)}
        />
      </td>
    </motion.tr>
  );
}
