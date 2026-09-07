import type { Lead } from '@/types/lead.types';
import type { PipelineStage } from '@/types/opportunity.types';
import { usersMock } from '@/mocks/users.mock';
import { hashString } from '@/utils/hashString';

const PIPELINE_STAGES: PipelineStage[] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
];

export interface LeadSystemInfo {
  createdByName: string;
  pipelineStage: PipelineStage;
}

/**
 * Dérive de façon déterministe qui a créé le lead et à quelle étape de
 * pipeline il se trouve — deux informations qui n'existent pas encore
 * comme champs propres sur `Lead` (Jour 8/9) et qui, pour une simple
 * fiche de consultation, n'ont pas besoin de l'être : elles sont
 * calculées à la volée à partir de l'identifiant du lead plutôt que
 * stockées, ce qui évite d'alourdir le modèle `Lead` pour un seul écran.
 */
export function getLeadSystemInfo(lead: Lead): LeadSystemInfo {
  const seed = hashString(lead.id);
  const creator = usersMock[seed % usersMock.length];

  return {
    createdByName: creator
      ? `${creator.firstName} ${creator.lastName}`
      : 'Utilisateur inconnu',
    pipelineStage: PIPELINE_STAGES[seed % PIPELINE_STAGES.length]!,
  };
}
