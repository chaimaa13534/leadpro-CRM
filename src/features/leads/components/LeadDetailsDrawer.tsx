import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Building2,
  UserRound,
  StickyNote,
  Tags,
  Target,
  BadgeDollarSign,
  Flag,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';
import { LeadStatusBadge } from './LeadStatusBadge';
import { leadStatusMeta, leadPriorityMeta } from '../constants';
import type { ManagedLead } from '../types/lead-management.types';

interface LeadDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  lead: ManagedLead | null;
}

/** Render a label/value row in the details panel. */
function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-2 text-[13px] text-text-tertiary">
        {icon}
        {label}
      </dt>
      <dd className="text-[13px] font-medium text-text-primary text-right">
        {value}
      </dd>
    </div>
  );
}

/**
 * Panneau latéral (modal large) affichant toutes les informations d'un
 * lead : contact, entreprise, source, statut, priorité, valeur estimée,
 * responsable, notes et dates.
 *
 * Conçu pour être étendu plus tard avec les sections Activities, Tasks,
 * Timeline et Opportunity.
 */
export function LeadDetailsDrawer({
  open,
  onClose,
  lead,
}: LeadDetailsDrawerProps) {
  if (!lead) return null;

  const statusLabel = leadStatusMeta(lead.status).label;
  const priorityLabel = leadPriorityMeta(lead.priority).label;
  const contactName = lead.contact
    ? `${lead.contact.firstName} ${lead.contact.lastName}`
    : '—';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails du lead"
      description={contactName}
      size="lg"
    >
      <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
        {/* Identity header */}
        <div className="flex items-center gap-4">
          <Avatar
            firstName={lead.contact?.firstName ?? '—'}
            lastName={lead.contact?.lastName ?? ''}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-text-primary">
              {contactName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <LeadStatusBadge status={lead.status} />
              <span className="inline-flex items-center gap-1 rounded-md bg-background-tertiary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                <Flag className="h-3 w-3" aria-hidden="true" />
                {priorityLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Suivi */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Suivi
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow
              label="Statut"
              value={statusLabel}
              icon={<Target className="h-3.5 w-3.5" />}
            />
            <DetailRow
              label="Priorité"
              value={priorityLabel}
              icon={<Flag className="h-3.5 w-3.5" />}
            />
            <DetailRow
              label="Valeur estimée"
              value={
                lead.estimatedValue > 0
                  ? new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }).format(lead.estimatedValue)
                  : 'Non renseignée'
              }
              icon={<BadgeDollarSign className="h-3.5 w-3.5" />}
            />
          </dl>
        </section>

        {/* Contact */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            Contact
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow
              label="Nom"
              value={contactName}
              icon={<UserRound className="h-3.5 w-3.5" />}
            />
            <DetailRow
              label="Email"
              value={lead.contact?.email ?? 'Non renseigné'}
              icon={<Mail className="h-3.5 w-3.5" />}
            />
            <DetailRow
              label="Téléphone"
              value={lead.contact?.phone ?? 'Non renseigné'}
              icon={<Phone className="h-3.5 w-3.5" />}
            />
          </dl>
        </section>

        {/* Relations */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            Relations
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow
              label="Entreprise"
              value={lead.company?.name ?? 'Non renseignée'}
              icon={<Building2 className="h-3.5 w-3.5" />}
            />
            <DetailRow
              label="Source"
              value={lead.source?.name ?? 'Non renseignée'}
              icon={<Tags className="h-3.5 w-3.5" />}
            />
          </dl>
        </section>

        {/* Responsable */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            Responsable
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <Avatar
              firstName={lead.owner.firstName}
              lastName={lead.owner.lastName}
              src={lead.owner.avatar ?? undefined}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-text-primary">
                {lead.owner.firstName} {lead.owner.lastName}
              </p>
              <p className="truncate text-[12px] text-text-tertiary">
                {lead.owner.email}
              </p>
            </div>
          </div>
        </section>

        {/* Notes */}
        {lead.notes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-surface-secondary/40 p-4"
          >
            <h3 className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-text-secondary">
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              Notes
            </h3>
            <p className="text-[13px] leading-relaxed text-text-tertiary">
              {lead.notes}
            </p>
          </motion.div>
        )}

        {/* Dates */}
        <section>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            Dates
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow
              label="Créé le"
              value={lead.createdAt ? formatDate(lead.createdAt, 'datetime') : '—'}
            />
            <DetailRow
              label="Mis à jour le"
              value={lead.updatedAt ? formatDate(lead.updatedAt, 'datetime') : '—'}
            />
          </dl>
        </section>
      </div>
    </Modal>
  );
}
