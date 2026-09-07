import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { ContactStatusBadge } from '@/features/contacts/components/ContactStatusBadge';
import { ContactActions } from '@/features/contacts/components/ContactActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Contact } from '@/types/contact.types';

export interface ContactCardProps {
  contact: Contact;
  index: number;
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactCard({
  contact,
  index,
  onView,
  onEdit,
  onDelete,
}: ContactCardProps) {
  const owner = usersMock.find((user) => user.id === contact.ownerId);
  const fullName = `${contact.firstName} ${contact.lastName}`;

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
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
                {getInitials(fullName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-body font-medium text-text-primary">
                  {fullName}
                </p>
                <p className="truncate text-caption text-text-secondary/70">
                  {contact.company ?? '—'}
                </p>
              </div>
            </div>
            <ContactActions
              contactName={fullName}
              onView={() => onView(contact)}
              onEdit={() => onEdit(contact)}
              onDelete={() => onDelete(contact)}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <ContactStatusBadge status={contact.status} />
          </div>

          <div className="border-t border-border/50" />

          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-caption">
            <dt className="text-text-secondary/70">Email</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contact.email}
            </dd>
            <dt className="text-text-secondary/70">Téléphone</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contact.phone ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Poste</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contact.jobTitle ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Ville</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contact.city ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Pays</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {contact.country ?? '—'}
            </dd>
            <dt className="text-text-secondary/70">Responsable</dt>
            <dd className="truncate text-right font-medium text-text-primary">
              {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
            </dd>
            <dt className="text-text-secondary/70">Dernière activité</dt>
            <dd className="text-figure truncate text-right font-medium text-text-primary">
              {contact.lastActivityAt
                ? formatDate(contact.lastActivityAt, 'short')
                : '—'}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </motion.div>
  );
}

