import type { Lead } from '@/types/lead.types';
import type { LeadActivity, LeadActivityType } from '@/features/leads/types';
import { hashString } from '@/utils/hashString';

const ACTORS = [
  'Sara Idrissi',
  'Yassine Bennani',
  'Omar Chraibi',
  'Alex Martin',
];

interface ActivityTemplate {
  type: LeadActivityType;
  title: string;
  durationMinutes?: number;
}

const TEMPLATES: ActivityTemplate[] = [
  { type: 'call', title: 'Appel de qualification', durationMinutes: 15 },
  { type: 'email', title: "Envoi d'un email de suivi" },
  { type: 'task', title: 'Préparer la proposition commerciale' },
  { type: 'meeting', title: 'Réunion de présentation', durationMinutes: 45 },
  { type: 'call', title: 'Appel de relance', durationMinutes: 10 },
  { type: 'task', title: 'Vérifier le budget disponible' },
];

/**
 * Génère les activités (appels, emails, tâches, réunions) associées à un
 * lead, de façon déterministe. Distinct de `mocks/activities.mock.ts`
 * (global, fil d'activité du Dashboard) — voir `features/leads/types.ts`.
 */
export function getActivitiesForLead(lead: Lead): LeadActivity[] {
  const seed = hashString(lead.id);
  const count = 3 + (seed % 3);
  const createdAtMs = new Date(lead.createdAt).getTime();
  const span = Math.max(Date.now() - createdAtMs, 60 * 60 * 1000);

  return Array.from({ length: count }, (_, index) => {
    const template = TEMPLATES[(seed + index) % TEMPLATES.length]!;
    const offsetRatio = (index + 1) / (count + 1);

    return {
      id: `${lead.id}-activity-${index}`,
      leadId: lead.id,
      type: template.type,
      title: template.title,
      actorName: ACTORS[(seed + index * 2) % ACTORS.length]!,
      occurredAt: new Date(createdAtMs + span * offsetRatio).toISOString(),
      durationMinutes: template.durationMinutes,
    };
  }).sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}
