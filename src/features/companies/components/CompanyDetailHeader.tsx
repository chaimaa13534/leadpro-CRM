import { motion } from 'framer-motion';
import { CompanyStatusBadge } from '@/features/companies/components/CompanyStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CompanyQuickActions } from '@/features/companies/components/CompanyQuickActions';
import { formatDate } from '@/utils/formatDate';
import type { Company } from '@/types/company.types';

export interface CompanyDetailHeaderProps {
  company: Company;
}

export function CompanyDetailHeader({ company }: CompanyDetailHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between"
    >
      <div className="flex items-start gap-4">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`Logo ${company.name}`}
            className="size-14 shrink-0 rounded-xl bg-muted object-contain"
          />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-title font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            {company.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h3 text-text-primary">{company.name}</h1>
          <p className="text-body text-text-secondary">
            {company.industry ?? 'Secteur non renseigné'}
            {company.city ? ` · ${company.city}` : ''}
            {company.country ? `, ${company.country}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <CompanyStatusBadge status={company.status} />
            {company.tags?.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
            <span className="text-caption text-text-secondary">
              Créée le {formatDate(company.createdAt, 'medium')}
            </span>
          </div>
        </div>
      </div>

      <CompanyQuickActions company={company} />
    </motion.div>
  );
}

