import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Globe, User, Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';
import type { ManagedCompany } from '../types/company-management.types';

interface CompanyDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  company: ManagedCompany | null;
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
 * Panneau latéral (modal large) affichant toutes les informations d'une
 * entreprise : coordonnées, responsable, statistiques et dates.
 */
export function CompanyDetailsDrawer({
  open,
  onClose,
  company,
}: CompanyDetailsDrawerProps) {
  if (!company) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails de l’entreprise"
      description={company.name}
      size="lg"
    >
      <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
        {/* Identity header */}
        <div className="flex items-center gap-4">
<Avatar
            firstName={company.name}
            lastName=""
            src={undefined}
            size="lg"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-text-primary">
              {company.name}
            </p>
            {company.industry && (
              <p className="truncate text-[13px] text-text-tertiary">
                {company.industry}
              </p>
            )}
          </div>
          <div className="ml-auto flex flex-col items-end gap-1.5">
            <Badge variant="primary">
              {company.contactCount} contact
              {company.contactCount > 1 ? 's' : ''}
            </Badge>
            <Badge variant="info">
              {company.opportunityCount} opportunité
              {company.opportunityCount > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Coordonnées */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            Coordonnées
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow label="Email" value={company.email ?? 'Non renseigné'} icon={<Mail className="h-3.5 w-3.5" />} />
            <DetailRow label="Téléphone" value={company.phone ?? 'Non renseigné'} icon={<Phone className="h-3.5 w-3.5" />} />
            <DetailRow label="Site web" value={company.website ?? 'Non renseigné'} icon={<Globe className="h-3.5 w-3.5" />} />
            <DetailRow
              label="Adresse"
              value={[company.address, company.city, company.country]
                .filter(Boolean)
                .join(', ') || 'Non renseignée'}
              icon={<MapPin className="h-3.5 w-3.5" />}
            />
          </dl>
        </section>

        {/* Responsable */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Responsable
          </h3>
          <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <Avatar
              firstName={company.owner.firstName}
              lastName={company.owner.lastName}
              src={company.owner.avatar ?? undefined}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-text-primary">
                {company.owner.firstName} {company.owner.lastName}
              </p>
              <p className="truncate text-[12px] text-text-tertiary">
                {company.owner.email}
              </p>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            Statistiques
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow label="Contacts" value={String(company.contactCount)} />
            <DetailRow label="Opportunités" value={String(company.opportunityCount)} />
            <DetailRow label="Leads" value={String(company.leadCount)} />
          </dl>
        </section>

        {/* Dates */}
        <section>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-text-tertiary">
            Dates
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow
              label="Créée le"
              value={company.createdAt ? formatDate(company.createdAt, 'datetime') : '—'}
            />
            <DetailRow
              label="Mis à jour le"
              value={company.updatedAt ? formatDate(company.updatedAt, 'datetime') : '—'}
            />
          </dl>
        </section>

        {/* Description */}
        {company.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-surface-secondary/40 p-4"
          >
            <h3 className="mb-1 text-[13px] font-semibold text-text-secondary">
              Description
            </h3>
            <p className="text-[13px] leading-relaxed text-text-tertiary">
              {company.description}
            </p>
          </motion.div>
        )}
      </div>
</Modal>
  );
}
