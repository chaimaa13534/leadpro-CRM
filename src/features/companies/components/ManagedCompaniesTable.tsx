import { motion } from 'framer-motion';
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  GitBranch,
  Target,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/formatDate';
import type { ManagedCompany } from '../types/company-management.types';

export interface ManagedCompaniesTableProps {
  companies: ManagedCompany[];
  onView: (company: ManagedCompany) => void;
  onEdit: (company: ManagedCompany) => void;
  onDelete: (company: ManagedCompany) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  isLoading: boolean;
  isError?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAdd?: () => void;
  canCreate?: boolean;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

/**
 * Table responsive des entreprises (pilotée par l'API). Sur grand écran, un
 * tableau ; sur mobile, des cartes empilées. Gère les états de chargement,
 * d'erreur et vide, ainsi que les permissions d'édition / suppression.
 */
export function ManagedCompaniesTable({
  companies,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  isLoading,
  isError = false,
  error,
  onRetry,
  onAdd,
  canCreate = false,
  hasActiveFilters = false,
  onResetFilters,
}: ManagedCompaniesTableProps) {
  if (isLoading) {
    return <CompaniesTableSkeleton />;
  }

  if (isError || Boolean(error)) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Building2 className="h-6 w-6 text-text-tertiary" />}
          title="Impossible de charger les entreprises"
          description="Une erreur est survenue lors de la récupération des données."
          action={{ label: 'Réessayer', onClick: onRetry }}
        />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Building2 className="h-6 w-6 text-text-tertiary" />}
          title={hasActiveFilters ? 'Aucune entreprise trouvée' : 'Aucune entreprise'}
          description={
            hasActiveFilters
              ? 'Aucune entreprise ne correspond à vos filtres ou à votre recherche.'
              : canCreate
                ? 'Ajoutez votre première entreprise pour commencer.'
                : 'Aucune entreprise pour le moment.'
          }
          action={
            hasActiveFilters && onResetFilters
              ? { label: 'Réinitialiser les filtres', onClick: onResetFilters }
              : canCreate
                ? { label: 'Ajouter une entreprise', onClick: onAdd }
                : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              <TableHead>Entreprise</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>Ville / Pays</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Statistiques</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Header cell ── */
function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={
        'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary ' +
        (className ?? '')
      }
    >
      {children}
    </th>
  );
}

/* ── Company logo placeholder ── */
function CompanyLogo({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-[13px] font-semibold text-accent">
      {initials || <Building2 className="h-4 w-4" />}
    </div>
  );
}

/* ── Desktop row ── */
function CompanyRow({
  company,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  company: ManagedCompany;
  onView: (c: ManagedCompany) => void;
  onEdit: (c: ManagedCompany) => void;
  onDelete: (c: ManagedCompany) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group transition-colors hover:bg-surface-hover/50"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <CompanyLogo name={company.name} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-text-primary">
              {company.name}
            </p>
            <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
              <Mail className="h-3 w-3 shrink-0" />
              {company.email ?? '—'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {company.industry ?? '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-[13px] text-text-secondary">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
          <span className="truncate">
            {[company.city, company.country].filter(Boolean).join(', ') || '—'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar
            firstName={company.owner.firstName}
            lastName={company.owner.lastName}
            src={company.owner.avatar ?? undefined}
            size="sm"
          />
          <span className="text-[13px] text-text-secondary">
            {company.owner.firstName} {company.owner.lastName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 text-[12px] text-text-secondary">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-text-tertiary" />
            {company.contactCount}
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-text-tertiary" />
            {company.opportunityCount}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5 text-text-tertiary" />
            {company.leadCount}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {formatDate(company.createdAt, 'short')}
      </td>
      <td className="px-4 py-3">
        <RowActions
          company={company}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </td>
    </motion.tr>
  );
}

/* ── Mobile card ── */
function CompanyCard({
  company,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  company: ManagedCompany;
  onView: (c: ManagedCompany) => void;
  onEdit: (c: ManagedCompany) => void;
  onDelete: (c: ManagedCompany) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex items-center gap-3">
        <CompanyLogo name={company.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-primary">
            {company.name}
          </p>
          <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
            <MapPin className="h-3 w-3 shrink-0" />
            {[company.city, company.country].filter(Boolean).join(', ') || '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-text-secondary">
        <span className="flex items-center gap-1">
          <Target className="h-3.5 w-3.5 text-text-tertiary" />
          {company.industry ?? '—'}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-text-tertiary" />
          {company.contactCount} contacts
        </span>
        <span className="flex items-center gap-1">
          <Target className="h-3.5 w-3.5 text-text-tertiary" />
          {company.opportunityCount} opportunités
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="h-3.5 w-3.5 text-text-tertiary" />
          {company.leadCount} leads
        </span>
      </div>

      {(company.phone || company.email) && (
        <div className="mt-2 flex flex-col gap-0.5 text-[12px] text-text-tertiary">
          {company.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> {company.phone}
            </span>
          )}
          {company.email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3 shrink-0" /> {company.email}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-1 border-t border-border pt-3">
        <span className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
          <Avatar
            firstName={company.owner.firstName}
            lastName={company.owner.lastName}
            src={company.owner.avatar ?? undefined}
            size="xs"
          />
          {company.owner.firstName} {company.owner.lastName}
        </span>
        <RowActions
          company={company}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>
    </motion.div>
  );
}

/* ── Shared row action buttons ── */
function RowActions({
  company,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  company: ManagedCompany;
  onView: (c: ManagedCompany) => void;
  onEdit: (c: ManagedCompany) => void;
  onDelete: (c: ManagedCompany) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onView(company)}
        aria-label="Voir les détails"
        title="Détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEdit && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onEdit(company)}
          aria-label="Modifier"
          title="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onDelete(company)}
          aria-label="Supprimer"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4 text-danger-400" />
        </Button>
      )}
    </div>
  );
}

/* ── Loading skeleton ── */
function CompaniesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-skeleton" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <td key={col} className="px-4 py-3">
                    <div className="h-3 w-full max-w-27.5 animate-pulse rounded bg-skeleton" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 animate-pulse rounded bg-skeleton" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-skeleton" />
              </div>
            </div>
            <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
