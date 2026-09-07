import { motion } from 'framer-motion';
import { ContactStatusBadge } from '@/features/contacts/components/ContactStatusBadge';
import { ContactActions } from '@/features/contacts/components/ContactActions';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';
import type { Contact } from '@/types/contact.types';

export interface ContactRowProps {
  contact: Contact;
  index: number;
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactRow({
  contact,
  index,
  onView,
  onEdit,
  onDelete,
}: ContactRowProps) {
  const owner = usersMock.find((user) => user.id === contact.ownerId);
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
      className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-muted/60"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-800/50 dark:text-primary-300">
            {getInitials(fullName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-body font-medium text-text-primary">
              {fullName}
            </p>
            <p className="truncate text-caption text-text-secondary/70">
              {contact.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {contact.jobTitle ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {contact.company ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {contact.phone ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {contact.city ?? '—'}
      </td>
      <td className="px-3 py-4 text-body text-text-secondary/80">
        {contact.country ?? '—'}
      </td>
      <td className="px-3 py-4">
        <ContactStatusBadge status={contact.status} />
      </td>
      <td className="px-3 py-4">
        {owner ? (
          <div className="flex items-center gap-2 text-body text-text-secondary/80">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-text-secondary">
              {getInitials(`${owner.firstName} ${owner.lastName}`)}
            </span>
            <span className="truncate">
              {owner.firstName} {owner.lastName}
            </span>
          </div>
        ) : (
          <span className="text-text-secondary/60">—</span>
        )}
      </td>
      <td className="text-figure whitespace-nowrap px-3 py-4 text-caption text-text-secondary/70">
        {contact.lastActivityAt
          ? formatDate(contact.lastActivityAt, 'short')
          : '—'}
      </td>
      <td className="px-3 py-4 text-right">
        <ContactActions
          contactName={fullName}
          onView={() => onView(contact)}
          onEdit={() => onEdit(contact)}
          onDelete={() => onDelete(contact)}
        />
      </td>
    </motion.tr>
  );
}

