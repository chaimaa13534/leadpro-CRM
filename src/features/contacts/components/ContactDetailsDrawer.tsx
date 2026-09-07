import { motion } from 'framer-motion';
import { Mail, Phone, Building2, UserRound, Briefcase, StickyNote } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';
import type { ManagedContact } from '../types/contact-management.types';

interface ContactDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  contact: ManagedContact | null;
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
 * contact : coordonnées, entreprise, responsable, notes et dates.
 *
 * Conçu pour être étendu plus tard avec les relations (Leads,
 * Opportunités, Tâches, Activités, Timeline).
 */
export function ContactDetailsDrawer({
  open,
  onClose,
  contact,
}: ContactDetailsDrawerProps) {
  if (!contact) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails du contact"
      description={`${contact.firstName} ${contact.lastName}`}
      size="lg"
    >
      <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
        {/* Identity header */}
        <div className="flex items-center gap-4">
          <Avatar firstName={contact.firstName} lastName={contact.lastName} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-text-primary">
              {contact.firstName} {contact.lastName}
            </p>
            {contact.position && (
              <p className="truncate text-[13px] text-text-tertiary">
                {contact.position}
              </p>
            )}
          </div>
        </div>

        {/* Coordonnées */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Coordonnées
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow label="Email" value={contact.email ?? 'Non renseigné'} icon={<Mail className="h-3.5 w-3.5" />} />
            <DetailRow label="Téléphone" value={contact.phone ?? 'Non renseigné'} icon={<Phone className="h-3.5 w-3.5" />} />
            <DetailRow label="Poste" value={contact.position ?? 'Non renseigné'} icon={<Briefcase className="h-3.5 w-3.5" />} />
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
              value={contact.company.name}
              icon={<Building2 className="h-3.5 w-3.5" />}
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
              firstName={contact.owner.firstName}
              lastName={contact.owner.lastName}
              src={contact.owner.avatar ?? undefined}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-text-primary">
                {contact.owner.firstName} {contact.owner.lastName}
              </p>
              <p className="truncate text-[12px] text-text-tertiary">
                {contact.owner.email}
              </p>
            </div>
          </div>
        </section>

        {/* Notes */}
        {contact.notes && (
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
              {contact.notes}
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
              value={contact.createdAt ? formatDate(contact.createdAt, 'datetime') : '—'}
            />
            <DetailRow
              label="Mis à jour le"
              value={contact.updatedAt ? formatDate(contact.updatedAt, 'datetime') : '—'}
            />
          </dl>
        </section>
      </div>
    </Modal>
  );
}
