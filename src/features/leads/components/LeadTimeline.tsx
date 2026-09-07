import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icons } from '@/components/ui/icons';
import { LeadTimelineItem } from '@/features/leads/components/LeadTimelineItem';
import { getTimelineForLead } from '@/features/leads/mocks/timeline.mock';
import { formatDate } from '@/utils/formatDate';
import type { Lead } from '@/types/lead.types';

export interface LeadTimelineProps {
  lead: Lead;
  /**
   * Mode compact (tableau dense) pour l'onglet "History" — même donnée
   * que la Timeline narrative, présentation différente. Évite de créer
   * un composant `LeadHistoryTable` séparé pour un jeu de données
   * identique (DRY).
   */
  compact?: boolean;
}

/** Historique du lead : appels, emails, réunions, notes, changements de statut. */
export function LeadTimeline({ lead, compact = false }: LeadTimelineProps) {
  const events = getTimelineForLead(lead);

  if (events.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.calendar className="size-6" aria-hidden="true" />}
          title="Aucun événement"
          description="L'historique de ce lead apparaîtra ici."
        />
      </Card>
    );
  }

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique complet</CardTitle>
          <CardDescription>
            Journal détaillé de tous les événements
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2 text-left text-label tracking-wide text-text-secondary uppercase">
                  Événement
                </th>
                <th className="px-3 py-2 text-left text-label tracking-wide text-text-secondary uppercase">
                  Auteur
                </th>
                <th className="px-3 py-2 text-right text-label tracking-wide text-text-secondary uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-border transition-colors duration-150 hover:bg-muted"
                >
                  <td className="px-4 py-3 text-body text-text-primary">
                    {event.title}
                  </td>
                  <td className="px-3 py-3 text-body text-text-secondary">
                    {event.actorName}
                  </td>
                  <td className="text-figure px-3 py-3 text-right text-caption text-text-secondary">
                    {formatDate(event.occurredAt, 'datetime')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>Chronologie des interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {events.map((event, index) => (
            <LeadTimelineItem
              key={event.id}
              event={event}
              index={index}
              isLast={index === events.length - 1}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
