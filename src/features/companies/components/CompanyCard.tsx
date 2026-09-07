import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { CompanyStatusBadge } from '@/features/companies/components/CompanyStatusBadge';
import { CompanyActions } from '@/features/companies/components/CompanyActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Company } from '@/types/company.types';

export interface CompanyCardProps {
  company: Company;
  index: number;
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyCard({
  company,
  index,
  onView,
  onEdit,
  onDelete,
}: CompanyCardProps) {
  const owner = usersMock.find((user) => user.id === company.ownerId);
  const contactCount = company.linkedContactIds.length;
  const opportunityCount = company.linkedOpportunityIds.length;

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
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`Logo ${company.name}`}
                  className="size-10 shrink-0 rounded-lg bg-muted object-contain"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-body font-medium text-text-primary">
                  {company.name}
                </p>
                <p className="truncate text-caption text-text-secondary/70">
                  {company.industry ?? '—'}
                </p>
              </div>
            </div>
            <CompanyActions
              companyName={company.name}
              onView={() => onView(company)}
              onEdit={() => onEdit(company)}
              onDelete={() => onDelete(company)}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <CompanyStatusBadge status={company.status} />
          </div>

          <div className="border-t border-border/50" />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-caption">
            <dt className="text-text-secondary/70">Pays</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {company.country ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Ville</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {company.city ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Contacts</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contactCount}
            </dd>
            <dt className="text-text-secondary/70">Opportunités</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {opportunityCount}
            </dd>
            <dt className="text-text-secondary/70">Valeur estimée</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {company.estimatedRevenue
                ? formatCurrency(company.estimatedRevenue)
                : '—'}
            </dd>
            <dt className="text-text-secondary/70">Responsable</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
            </dd>
            <dt className="text-text-secondary/70">Dernière activité</dt>
            <dd className="truncate text-right font-medium text-text-primary tabular-nums">
              {company.lastActivityAt
                ? formatDate(company.lastActivityAt, 'short')
                : '—'}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </motion.div>
  );
}

