import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { contactsMock } from '@/mocks/contacts.mock';
import { getInitials } from '@/utils/getInitials';
import type { ID } from '@/types/common.types';

export interface CompanyContactsProps {
  linkedContactIds: ID[];
}

export function CompanyContacts({ linkedContactIds }: CompanyContactsProps) {
  const linkedContacts = contactsMock.filter((c) =>
    linkedContactIds.includes(c.id),
  );

  if (linkedContacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts liés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-caption text-text-secondary/60">
            Aucun contact lié à cette entreprise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts liés ({linkedContacts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {linkedContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700">
                {getInitials(`${contact.firstName} ${contact.lastName}`)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-medium text-text-primary truncate">
                  {contact.firstName} {contact.lastName}
                </p>
                <p className="text-caption text-text-secondary/70 truncate">
                  {contact.jobTitle ?? '—'} · {contact.email}
                </p>
              </div>
              <span className="shrink-0 text-caption text-text-secondary/60">
                <Icons.chevronRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

