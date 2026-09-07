import { motion } from 'framer-motion';
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  UserRound,
  Tags,
  Target,
  BadgeDollarSign,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/formatDate';
import { LeadStatusBadge } from './LeadStatusBadge';
import type { ManagedLead } from '../types/lead-management.types';

export interface ManagedLeadsTableProps {
  leads: ManagedLead[];
  onView: (lead: ManagedLead) => void;
  onEdit: (lead: ManagedLead) => void;
  onDelete: (lead: ManagedLead) => void;
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

/** Format an estimated value as a compact amount. */
function formatValue(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Table responsive des leads (pilotée par l'API). Sur grand écran, un
 * tableau ; sur mobile, des cartes empilées. Gère les états de chargement,
 * d'erreur et vide, ainsi que les permissions d'édition / suppression.
 */
export function ManagedLeadsTable({
  leads,
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
}: ManagedLeadsTableProps) {
  if (isLoading) {
    return <LeadsTableSkeleton />;
  }

  if (isError || Boolean(error)) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Target className="h-6 w-6 text-text-tertiary" />}
          title="Impossible de charger les leads"
          description="Une erreur est survenue lors de la récupération des données."
          action={{ label: 'Réessayer', onClick: onRetry }}
        />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Target className="h-6 w-6 text-text-tertiary" />}
          title={hasActiveFilters ? 'Aucun lead trouvé' : 'Aucun lead'}
          description={
            hasActiveFilters
              ? 'Aucun lead ne correspond à vos filtres ou à votre recherche.'
              : canCreate
                ? 'Ajoutez votre premier lead pour commencer.'
                : 'Aucun lead pour le moment.'
          }
          action={
            hasActiveFilters && onResetFilters
              ? { label: 'Réinitialiser les filtres', onClick: onResetFilters }
              : canCreate
                ? { label: 'Ajouter un lead', onClick: onAdd }
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
              <TableHead>Lead</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <LeadTableRow
                key={lead.id}
                lead={lead}
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
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
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

/** Render the identity of a lead based on the linked contact. */
function LeadIdentity({ lead }: { lead: ManagedLead }) {
  const firstName = lead.contact?.firstName ?? '—';
  const lastName = lead.contact?.lastName ?? '';
  const email = lead.contact?.email;
  const phone = lead.contact?.phone;

  return (
    <div className="flex items-center gap-3">
      <Avatar firstName={firstName} lastName={lastName} size="md" />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-text-primary">
          {firstName} {lastName}
        </p>
        <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
          {email ? (
            <>
              <Mail className="h-3 w-3 shrink-0" />
              {email}
            </>
          ) : (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 shrink-0" />
              {phone ?? '—'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Desktop row ── */
function LeadTableRow({
  lead,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  lead: ManagedLead;
  onView: (c: ManagedLead) => void;
  onEdit: (c: ManagedLead) => void;
  onDelete: (c: ManagedLead) => void;
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
        <LeadIdentity lead={lead} />
      </td>
      <td className="px-4 py-3">
        {lead.company ? (
          <span className="inline-flex items-center gap-1 text-[13px] text-text-secondary">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
            {lead.company.name}
          </span>
        ) : (
          <span className="text-[13px] text-text-tertiary">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {lead.contact
          ? `${lead.contact.firstName} ${lead.contact.lastName}`
          : '—'}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-[13px] text-text-secondary">
          <Tags className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
          {lead.source?.name ?? '—'}
        </span>
      </td>
      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary capitalize">
        {lead.priority}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar
            firstName={lead.owner.firstName}
            lastName={lead.owner.lastName}
            src={lead.owner.avatar ?? undefined}
            size="sm"
          />
          <span className="text-[13px] text-text-secondary">
            {lead.owner.firstName} {lead.owner.lastName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <RowActions
          lead={lead}
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
function LeadCard({
  lead,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  lead: ManagedLead;
  onView: (c: ManagedLead) => void;
  onEdit: (c: ManagedLead) => void;
  onDelete: (c: ManagedLead) => void;
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
        <Avatar
          firstName={lead.contact?.firstName ?? '—'}
          lastName={lead.contact?.lastName ?? ''}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-primary">
            {lead.contact
              ? `${lead.contact.firstName} ${lead.contact.lastName}`
              : 'Lead sans contact'}
          </p>
          <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
            <Building2 className="h-3 w-3 shrink-0" />
            {lead.company?.name ?? '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 text-[12px] text-text-tertiary">
        {lead.contact?.email && (
          <span className="flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 shrink-0" /> {lead.contact.email}
          </span>
        )}
        {lead.contact?.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0" /> {lead.contact.phone}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Tags className="h-3 w-3 shrink-0" /> {lead.source?.name ?? '—'}
        </span>
        {lead.estimatedValue > 0 && (
          <span className="flex items-center gap-1">
            <BadgeDollarSign className="h-3 w-3 shrink-0" />
            {formatValue(lead.estimatedValue)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Avatar
            firstName={lead.owner.firstName}
            lastName={lead.owner.lastName}
            src={lead.owner.avatar ?? undefined}
            size="xs"
          />
          {lead.owner.firstName} {lead.owner.lastName}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <LeadStatusBadge status={lead.status} />
        <RowActions
          lead={lead}
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
  lead,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  lead: ManagedLead;
  onView: (c: ManagedLead) => void;
  onEdit: (c: ManagedLead) => void;
  onDelete: (c: ManagedLead) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onView(lead)}
        aria-label="Voir les détails"
        title="Détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEdit && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onEdit(lead)}
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
          onClick={() => onDelete(lead)}
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
function LeadsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-skeleton" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                  <td key={col} className="px-4 py-3">
                    <div className="h-3 w-full max-w-24 animate-pulse rounded bg-skeleton" />
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
              <div className="h-8 w-8 animate-pulse rounded-full bg-skeleton" />
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
