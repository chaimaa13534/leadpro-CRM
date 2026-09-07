import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContactStatusBadge } from '@/features/contacts/components/ContactStatusBadge';
import { getInitials } from '@/utils/getInitials';
import { formatDate } from '@/utils/formatDate';
import type { Contact } from '@/types/contact.types';

export interface ContactProfileProps {
  contact: Contact;
}

export function ContactProfile({ contact }: ContactProfileProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 tablet:flex-row tablet:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-title font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            {getInitials(fullName)}
          </span>
          <div className="flex flex-col items-center gap-2 text-center tablet:items-start tablet:text-left">
            <div>
              <h2 className="text-h4 text-text-primary">{fullName}</h2>
              <p className="text-body text-text-secondary">
                {contact.jobTitle ?? 'Poste non renseigné'}
                {contact.company ? ` · ${contact.company}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ContactStatusBadge status={contact.status} />
              {contact.tags?.map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-caption text-text-secondary/70">
              Contact créé le {formatDate(contact.createdAt, 'medium')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

