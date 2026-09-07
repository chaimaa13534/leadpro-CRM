import { motion } from 'framer-motion';
import { ContactStatusBadge } from '@/features/contacts/components/ContactStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { ContactQuickActions } from '@/features/contacts/components/ContactQuickActions';
import { getInitials } from '@/utils/getInitials';
import { formatDate } from '@/utils/formatDate';
import type { Contact } from '@/types/contact.types';

export interface ContactDetailHeaderProps {
  contact: Contact;
}

export function ContactDetailHeader({ contact }: ContactDetailHeaderProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-title font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          {getInitials(fullName)}
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h3 text-text-primary">{fullName}</h1>
          <p className="text-body text-text-secondary">
            {contact.jobTitle ? `${contact.jobTitle} · ` : ''}
            {contact.company ?? 'Entreprise non renseignée'}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <ContactStatusBadge status={contact.status} />
            {contact.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
            <span className="text-caption text-text-secondary">
              Contact créé le {formatDate(contact.createdAt, 'medium')}
            </span>
          </div>
        </div>
      </div>

      <ContactQuickActions contact={contact} />
    </motion.div>
  );
}

