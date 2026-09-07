import type { Lead } from '@/types/lead.types';
import type { TimelineEvent, TimelineEventType } from '@/features/leads/types';
import { LEAD_STATUSES } from '@/lib/constants/statuses.constants';
import { hashString } from '@/utils/hashString';

const ACTORS = [
  'Sara Idrissi',
  'Yassine Bennani',
  'Omar Chraibi',
  'Alex Martin',
];

interface EventTemplate {
  type: TimelineEventType;
  title: string;
  description?: string;
}

function buildTemplates(lead: Lead): EventTemplate[] {
  const statusLabel = LEAD_STATUSES[lead.status].label;

  return [
    {
      type: 'call',
      title: 'Appel de découverte',
      description: `Échange avec ${lead.firstName} pour comprendre le besoin.`,
    },
    {
      type: 'email',
      title: 'Envoi de la présentation',
      description: 'Présentation générale du produit envoyée par email.',
    },
    {
      type: 'note',
      title: 'Note ajoutée',
      description: 'Le lead a exprimé un intérêt pour une démo produit.',
    },
    {
      type: 'meeting',
      title: 'Réunion de démonstration',
      description: 'Démo produit réalisée en visioconférence.',
    },
    {
      type: 'status_change',
      title: `Statut changé en "${statusLabel}"`,
    },
  ];
}

/**
 * Génère un historique déterministe pour un lead donné : toujours le
 * même nombre d'événements (selon `hashString(lead.id)`), ancrés dans le
 * temps entre `lead.createdAt` et aujourd'hui — jamais après la date de
 * création réelle du lead, pour rester cohérent.
 */
export function getTimelineForLead(lead: Lead): TimelineEvent[] {
  const templates = buildTemplates(lead);
  const seed = hashString(lead.id);
  const eventCount = 2 + (seed % (templates.length - 1));

  const createdAtMs = new Date(lead.createdAt).getTime();
  const nowMs = Date.now();
  const span = Math.max(nowMs - createdAtMs, 60 * 60 * 1000);

  const events: TimelineEvent[] = [
    {
      id: `${lead.id}-event-created`,
      leadId: lead.id,
      type: 'created',
      title: 'Lead créé',
      description: `${lead.firstName} ${lead.lastName} a été ajouté depuis la source "${lead.source}".`,
      actorName: ACTORS[seed % ACTORS.length]!,
      occurredAt: lead.createdAt,
    },
  ];

  for (let index = 0; index < eventCount; index += 1) {
    const template = templates[index % templates.length]!;
    const offsetRatio = (index + 1) / (eventCount + 1);
    const occurredAtMs = createdAtMs + span * offsetRatio;

    events.push({
      id: `${lead.id}-event-${index}`,
      leadId: lead.id,
      type: template.type,
      title: template.title,
      description: template.description,
      actorName: ACTORS[(seed + index) % ACTORS.length]!,
      occurredAt: new Date(occurredAtMs).toISOString(),
    });
  }

  return events.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}
