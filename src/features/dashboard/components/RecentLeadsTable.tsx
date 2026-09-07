import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { leadsMock } from '@/mocks/leads.mock';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from '@/lib/constants/statuses.constants';
import { formatDate } from '@/utils/formatDate';

/**
 * Tableau des derniers leads créés. Pas de pagination aujourd'hui (brief
 * explicite) — affiche l'intégralité de `leadsMock`, qui restera de
 * taille raisonnable tant que le module Leads n'existe pas encore.
 */
export function RecentLeadsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Derniers Leads</CardTitle>
        <CardDescription>Les leads les plus récents</CardDescription>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-border text-left">
              <th className="px-6 py-2 text-label text-text-secondary">Nom</th>
              <th className="px-3 py-2 text-label text-text-secondary">
                Entreprise
              </th>
              <th className="px-3 py-2 text-label text-text-secondary">
                Source
              </th>
              <th className="px-3 py-2 text-label text-text-secondary">
                Statut
              </th>
              <th className="px-3 py-2 text-label text-text-secondary">Date</th>
              <th className="px-3 py-2 text-right text-label text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leadsMock.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="border-t border-border transition-colors duration-150 hover:bg-muted"
              >
                <td className="px-6 py-3 text-body text-text-primary">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="px-3 py-3 text-body text-text-secondary">
                  {lead.companyName ?? '—'}
                </td>
                <td className="px-3 py-3 text-body text-text-secondary">
                  {LEAD_SOURCES[lead.source].label}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={LEAD_STATUSES[lead.status].badgeVariant}>
                    {LEAD_STATUSES[lead.status].label}
                  </Badge>
                </td>
                <td className="text-figure px-3 py-3 text-caption text-text-secondary">
                  {formatDate(lead.createdAt, 'short')}
                </td>
                <td className="px-3 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions pour ${lead.firstName} ${lead.lastName}`}
                  >
                    <Icons.more className="size-4" aria-hidden="true" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
