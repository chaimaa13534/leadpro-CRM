import type { Lead } from '@/types/lead.types';
import type { LeadNote } from '@/features/leads/types';
import { hashString } from '@/utils/hashString';

const AUTHORS = [
  'Sara Idrissi',
  'Yassine Bennani',
  'Omar Chraibi',
  'Alex Martin',
];

function noteTemplates(lead: Lead): string[] {
  return [
    `Premier échange positif avec ${lead.firstName}. Besoin confirmé, budget à valider.`,
    "Le prospect souhaite une démonstration technique avant de s'engager.",
    'Décideur identifié : il faudra également convaincre la direction financière.',
    'Relance prévue la semaine prochaine si pas de retour.',
  ];
}

/**
 * Génère les notes associées à un lead, de façon déterministe. Le
 * widget `LeadNotesPanel` complète ensuite cette liste avec les notes
 * ajoutées localement pendant la session (état React, non persisté).
 */
export function getNotesForLead(lead: Lead): LeadNote[] {
  const seed = hashString(lead.id);
  const templates = noteTemplates(lead);
  const count = 1 + (seed % templates.length);
  const createdAtMs = new Date(lead.createdAt).getTime();

  return Array.from({ length: count }, (_, index) => ({
    id: `${lead.id}-note-${index}`,
    leadId: lead.id,
    authorName: AUTHORS[(seed + index) % AUTHORS.length]!,
    content: templates[index % templates.length]!,
    createdAt: new Date(
      createdAtMs + (index + 1) * 2 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  })).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
