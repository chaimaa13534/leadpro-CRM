import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';
import { OpportunityStageBadge } from '@/features/opportunities/components/OpportunityStageBadge';
import { OpportunityPriorityBadge } from '@/features/opportunities/components/OpportunityPriorityBadge';
import { OpportunityStatusBadge } from '@/features/opportunities/components/OpportunityStatusBadge';
import { OpportunityTags } from '@/features/opportunities/components/OpportunityTags';
import { OpportunityKPIs } from '@/features/opportunities/components/OpportunityKPIs';
import { usersMock } from '@/mocks/users.mock';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunityOverviewProps {
  opportunity: Opportunity;
}

const SOURCE_LABELS: Record<string, string> = {
  inbound: 'Inbound',
  outbound: 'Outbound',
  referral: 'Recommandation',
  website: 'Site web',
  social_media: 'Réseaux sociaux',
  event: 'Événement',
  cold_call: 'Appel sortant',
  email_campaign: 'Campagne email',
  partner: 'Partenaire',
  existing_customer: 'Client existant',
  other: 'Autre',
};

export function OpportunityOverview({ opportunity }: OpportunityOverviewProps) {
  const owner = usersMock.find((user) => user.id === opportunity.ownerId);

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs rapides */}
      <OpportunityKPIs opportunity={opportunity} />

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-2">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Nom de l'opportunité
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {opportunity.name}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Pipeline
              </dt>
              <dd className="text-body text-text-primary">
                {opportunity.pipeline}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Étape
              </dt>
              <dd>
                <OpportunityStageBadge stage={opportunity.stage} />
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Priorité
              </dt>
              <dd>
                <OpportunityPriorityBadge priority={opportunity.priority} />
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Statut
              </dt>
              <dd>
                <OpportunityStatusBadge status={opportunity.status} />
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Source
              </dt>
              <dd className="text-body text-text-primary">
                {SOURCE_LABELS[opportunity.source] ?? opportunity.source}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Probabilité
              </dt>
              <dd className="flex items-center gap-3">
                <Progress value={opportunity.probability} size="sm" variant="accent" className="w-24" />
                <span className="text-body tabular-nums text-text-primary">
                  {opportunity.probability}%
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Tags
              </dt>
              <dd>
                <OpportunityTags tags={opportunity.tags} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Valeur & Devise */}
      <Card>
        <CardHeader>
          <CardTitle>Valeur</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-3">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Montant
              </dt>
              <dd className="text-h2 tabular-nums font-semibold text-text-primary">
                {formatCurrency(opportunity.amount, opportunity.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Devise
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {opportunity.currency}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Valeur pondérée
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {formatCurrency(
                  (opportunity.amount * opportunity.probability) / 100,
                  opportunity.currency,
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-3">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Date de création
              </dt>
              <dd className="text-body text-text-primary">
                {formatDate(opportunity.createdAt, 'medium')}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Clôture estimée
              </dt>
              <dd className="text-body text-text-primary">
                {opportunity.expectedCloseDate
                  ? formatDate(opportunity.expectedCloseDate, 'medium')
                  : 'Non définie'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Dernière activité
              </dt>
              <dd className="text-body text-text-primary">
                {opportunity.lastActivityAt
                  ? formatDate(opportunity.lastActivityAt, 'medium')
                  : 'Aucune activité'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Relations */}
      <Card>
        <CardHeader>
          <CardTitle>Relations</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 tablet:grid-cols-3">
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Entreprise
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {opportunity.companyName ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Contact
              </dt>
              <dd className="text-body text-text-primary">
                {opportunity.contactName ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-caption font-medium text-text-secondary/70">
                Commercial
              </dt>
              <dd className="text-body font-medium text-text-primary">
                {owner ? `${owner.firstName} ${owner.lastName}` : '—'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Description */}
      {opportunity.description ? (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-text-primary leading-relaxed">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Notes */}
      {opportunity.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-text-primary leading-relaxed">
              {opportunity.notes}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

