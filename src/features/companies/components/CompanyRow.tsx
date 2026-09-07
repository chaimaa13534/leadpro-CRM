import { motion } from 'framer-motion';
import { CompanyStatusBadge } from '@/features/companies/components/CompanyStatusBadge';
import { CompanyActions } from '@/features/companies/components/CompanyActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Company } from '@/types/company.types';

export interface CompanyRowProps {
  company: Company;
  index: number;
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyRow({
  company,
  index,
  onView,
  onEdit,
  onDelete,
}: CompanyRowProps) {
  const owner = usersMock.find((user) => user.id === company.ownerId);
  const contactCount = company.linkedContactIds.length;
  const opportunityCount = company.linkedOpportunityIds.length;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
      className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-muted/60"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`Logo ${company.name}`}
              className="size-9 shrink-0 rounded-lg bg-muted object-contain"
            />
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-body font-medium text-text-primary">
              {company.name}
            </p>
            {company.industry ? (
              <p className="truncate text-caption text-text-secondary/70">
                {company.industry}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {company.industry ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {company.country ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {company.city ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80 text-center">
        <span className="font-medium tabular-nums">{contactCount}</span>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80 text-center">
        <span className="font-medium tabular-nums">{opportunityCount}</span>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80 tabular-nums">
        {company.estimatedRevenue
          ? formatCurrency(company.estimatedRevenue)
          : '—'}
      </td>
      <td className="px-3 py-4">
        {owner ? (
          <div className="flex items-center gap-2 text-body text-text-secondary/80">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-text-secondary">
              {owner.firstName.charAt(0)}
              {owner.lastName.charAt(0)}
            </span>
            <span className="truncate">
              {owner.firstName} {owner.lastName}
            </span>
          </div>
        ) : (
          <span className="text-text-secondary/60">—</span>
        )}
      </td>
      <td className="px-3 py-4">
        <CompanyStatusBadge status={company.status} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-caption text-text-secondary/70 tabular-nums">
        {company.lastActivityAt
          ? formatDate(company.lastActivityAt, 'short')
          : '—'}
      </td>
      <td className="px-3 py-4 text-right">
        <CompanyActions
          companyName={company.name}
          onView={() => onView(company)}
          onEdit={() => onEdit(company)}
          onDelete={() => onDelete(company)}
        />
      </td>
    </motion.tr>
  );
}

