import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InfoRow } from '@/features/leads/components/InfoRow';
import type { Lead } from '@/types/lead.types';

export interface LeadProfileCardProps {
  lead: Lead;
}

/** Carte "Informations générales" : identité et coordonnées du contact. */
export function LeadProfileCard({ lead }: LeadProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow label="Prénom" value={lead.firstName} />
          <InfoRow label="Nom" value={lead.lastName} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="Téléphone" value={lead.phone} />
          <InfoRow label="Poste" value={lead.jobTitle} />
          <InfoRow label="Entreprise" value={lead.companyName} />
          <InfoRow label="Secteur" value={lead.industry} />
          <InfoRow
            label="Site web"
            value={
              lead.companyWebsite ? (
                <a
                  href={lead.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 transition-colors duration-150 hover:text-primary-700"
                >
                  {lead.companyWebsite}
                </a>
              ) : undefined
            }
          />
        </dl>
      </CardContent>
    </Card>
  );
}
