import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { ContactTags } from '@/features/contacts/components/ContactTags';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import type { Contact } from '@/types/contact.types';

export interface ContactOverviewProps {
  contact: Contact;
}

export function ContactOverview({ contact }: ContactOverviewProps) {
  const owner = usersMock.find((user) => user.id === contact.ownerId);

  return (
    <div className="flex flex-col gap-6">
      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-2">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Email
              </dt>
              <dd className="text-body text-text-primary">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary-600"
                >
                  <Icons.mail className="size-3.5 text-text-secondary" aria-hidden="true" />
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Téléphone
              </dt>
              <dd className="text-body text-text-primary">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary-600"
                >
                  <Icons.phone className="size-3.5 text-text-secondary" aria-hidden="true" />
                  {contact.phone ?? '—'}
                </a>
              </dd>
            </div>
            {contact.mobile ? (
              <div>
                <dt className="text-caption font-medium text-text-secondary/70">
                  Mobile
                </dt>
                <dd className="text-body text-text-primary">
                  <a
                    href={`tel:${contact.mobile}`}
                    className="flex items-center gap-2 transition-colors hover:text-primary-600"
                  >
                    <Icons.phone className="size-3.5 text-text-secondary" aria-hidden="true" />
                    {contact.mobile}
                  </a>
                </dd>
              </div>
            ) : null}
            {contact.linkedIn ? (
              <div>
                <dt className="text-caption font-medium text-text-secondary/70">
                  LinkedIn
                </dt>
                <dd className="text-body text-text-primary">
                  <a
                    href={contact.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary-600"
                  >
                    {contact.linkedIn}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      {/* Entreprise */}
      <Card>
        <CardHeader>
          <CardTitle>Entreprise</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-2">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Entreprise
              </dt>
              <dd className="text-body text-text-primary">
                {contact.company ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Poste
              </dt>
              <dd className="text-body text-text-primary">
                {contact.jobTitle ?? '—'}
              </dd>
            </div>
            {contact.website ? (
              <div>
                <dt className="text-caption font-medium text-text-secondary/70">
                  Site web
                </dt>
                <dd className="text-body text-text-primary">
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary-600"
                  >
                    {contact.website}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent>
          {contact.address || contact.city || contact.country ? (
            <div className="flex flex-col gap-1 text-body text-text-primary">
              {contact.address ? <span>{contact.address}</span> : null}
              {contact.city || contact.country ? (
                <span>
                  {[contact.city, contact.country].filter(Boolean).join(', ')}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="text-caption text-text-secondary/60">
              Aucune adresse renseignée.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Informations */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-2">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Responsable
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Créé le
              </dt>
              <dd className="text-body text-text-primary">
                {formatDate(contact.createdAt, 'medium')}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Dernière activité
              </dt>
              <dd className="text-body text-text-primary">
                {contact.lastActivityAt
                  ? formatDate(contact.lastActivityAt, 'medium')
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Tags
              </dt>
              <dd>
                <ContactTags tags={contact.tags} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

