import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { CompanyTags } from '@/features/companies/components/CompanyTags';
import { CompanyKPIs } from '@/features/companies/components/CompanyKPIs';
import { usersMock } from '@/mocks/users.mock';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Company } from '@/types/company.types';

export interface CompanyOverviewProps {
  company: Company;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  const owner = usersMock.find((user) => user.id === company.ownerId);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <CompanyKPIs company={company} />

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
                {company.email ? (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2 transition-colors hover:text-primary-600"
                  >
                    <Icons.mail className="size-3.5 text-text-secondary" aria-hidden="true" />
                    {company.email}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Téléphone
              </dt>
              <dd className="text-body text-text-primary">
                {company.phone ? (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-2 transition-colors hover:text-primary-600"
                  >
                    <Icons.phone className="size-3.5 text-text-secondary" aria-hidden="true" />
                    {company.phone}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            {company.website ? (
              <div>
                <dt className="text-caption font-medium text-text-secondary/70">
                  Site web
                </dt>
                <dd className="text-body text-text-primary">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary-600"
                  >
                    {company.website}
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
          {company.address || company.city || company.country || company.zipCode ? (
            <div className="flex flex-col gap-1 text-body text-text-primary">
              {company.address ? <span>{company.address}</span> : null}
              <span>
                {[company.zipCode, company.city].filter(Boolean).join(' ')}
              </span>
              {company.country ? <span>{company.country}</span> : null}
            </div>
          ) : (
            <p className="text-caption text-text-secondary/60">
              Aucune adresse renseignée.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Informations commerciales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations commerciales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-2">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Secteur
              </dt>
              <dd className="text-body text-text-primary">
                {company.industry ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Taille
              </dt>
              <dd className="text-body text-text-primary">
                {company.size ?? '—'}
                {company.employeeCount ? ` (${company.employeeCount} employés)` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Chiffre d'affaires estimé
              </dt>
              <dd className="text-body text-text-primary tabular-nums">
                {company.estimatedRevenue
                  ? formatCurrency(company.estimatedRevenue)
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                N° TVA
              </dt>
              <dd className="text-body text-text-primary">
                {company.vatNumber ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Source
              </dt>
              <dd className="text-body text-text-primary">
                {company.source ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Description
              </dt>
              <dd className="text-body text-text-primary">
                {company.description ?? '—'}
              </dd>
            </div>
          </dl>
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
                Créée le
              </dt>
              <dd className="text-body text-text-primary">
                {formatDate(company.createdAt, 'medium')}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Dernière activité
              </dt>
              <dd className="text-body text-text-primary">
                {company.lastActivityAt
                  ? formatDate(company.lastActivityAt, 'medium')
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Tags
              </dt>
              <dd>
                <CompanyTags tags={company.tags} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

