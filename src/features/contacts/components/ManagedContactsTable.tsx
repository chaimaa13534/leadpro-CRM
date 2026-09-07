import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, Mail, Phone, Building2, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/formatDate';
import type { ManagedContact } from '../types/contact-management.types';

export interface ManagedContactsTableProps {
  contacts: ManagedContact[];
  onView: (contact: ManagedContact) => void;
  onEdit: (contact: ManagedContact) => void;
  onDelete: (contact: ManagedContact) => void;
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
 * Table responsive des contacts (pilotée par l'API). Sur grand écran, un
 * tableau ; sur mobile, des cartes empilées. Gère les états de chargement,
 * d'erreur et vide, ainsi que les permissions d'édition / suppression.
 */
export function ManagedContactsTable({
  contacts,
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
}: ManagedContactsTableProps) {
  if (isLoading) {
    return <ContactsTableSkeleton />;
  }

  if (isError || Boolean(error)) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Users className="h-6 w-6 text-text-tertiary" />}
          title="Impossible de charger les contacts"
          description="Une erreur est survenue lors de la récupération des données."
          action={{ label: 'Réessayer', onClick: onRetry }}
        />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <EmptyState
          icon={<Users className="h-6 w-6 text-text-tertiary" />}
          title={hasActiveFilters ? 'Aucun contact trouvé' : 'Aucun contact'}
          description={
            hasActiveFilters
              ? 'Aucun contact ne correspond à vos filtres ou à votre recherche.'
              : canCreate
                ? 'Ajoutez votre premier contact pour commencer.'
                : 'Aucun contact pour le moment.'
          }
          action={
            hasActiveFilters && onResetFilters
              ? { label: 'Réinitialiser les filtres', onClick: onResetFilters }
              : canCreate
                ? { label: 'Ajouter un contact', onClick: onAdd }
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
              <TableHead>Contact</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <ContactTableRow
                key={contact.id}
                contact={contact}
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
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
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

/* ── Desktop row ── */
function ContactTableRow({
  contact,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  contact: ManagedContact;
  onView: (c: ManagedContact) => void;
  onEdit: (c: ManagedContact) => void;
  onDelete: (c: ManagedContact) => void;
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
          <Avatar firstName={contact.firstName} lastName={contact.lastName} size="md" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-text-primary">
              {contact.firstName} {contact.lastName}
            </p>
            <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
              <Mail className="h-3 w-3 shrink-0" />
              {contact.email ?? '—'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        <div className="flex flex-col gap-0.5">
          <span>{contact.position ?? '—'}</span>
          {contact.phone && (
            <span className="flex items-center gap-1 text-[12px] text-text-tertiary">
              <Phone className="h-3 w-3" />
              {contact.phone}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-[13px] text-text-secondary">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
          {contact.company.name}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar
            firstName={contact.owner.firstName}
            lastName={contact.owner.lastName}
            src={contact.owner.avatar ?? undefined}
            size="sm"
          />
          <span className="text-[13px] text-text-secondary">
            {contact.owner.firstName} {contact.owner.lastName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-[13px] text-text-secondary">
        {formatDate(contact.createdAt, 'short')}
      </td>
      <td className="px-4 py-3">
        <RowActions
          contact={contact}
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
function ContactCard({
  contact,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  contact: ManagedContact;
  onView: (c: ManagedContact) => void;
  onEdit: (c: ManagedContact) => void;
  onDelete: (c: ManagedContact) => void;
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
        <Avatar firstName={contact.firstName} lastName={contact.lastName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-primary">
            {contact.firstName} {contact.lastName}
          </p>
          <p className="flex items-center gap-1 truncate text-[12px] text-text-tertiary">
            <Building2 className="h-3 w-3 shrink-0" />
            {contact.company.name}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 text-[12px] text-text-tertiary">
        {contact.position && <span>Poste : {contact.position}</span>}
        {contact.email && (
          <span className="flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 shrink-0" /> {contact.email}
          </span>
        )}
        {contact.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0" /> {contact.phone}
          </span>
        )}
        <span className="mt-1 flex items-center gap-1.5">
          <Avatar
            firstName={contact.owner.firstName}
            lastName={contact.owner.lastName}
            src={contact.owner.avatar ?? undefined}
            size="xs"
          />
          {contact.owner.firstName} {contact.owner.lastName}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-3">
        <RowActions
          contact={contact}
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
  contact,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  contact: ManagedContact;
  onView: (c: ManagedContact) => void;
  onEdit: (c: ManagedContact) => void;
  onDelete: (c: ManagedContact) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => onView(contact)}
        aria-label="Voir les détails"
        title="Détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEdit && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onEdit(contact)}
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
          onClick={() => onDelete(contact)}
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
function ContactsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-skeleton" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6].map((col) => (
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
