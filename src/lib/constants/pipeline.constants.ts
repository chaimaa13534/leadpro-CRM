import type { PipelineStage } from '@/types/opportunity.types';
import { COLORS } from '@/lib/constants/colors.constants';

/**
 * Ordre officiel des étapes du pipeline commercial. L'ordre du tableau fait
 * foi pour tout affichage de type Kanban ou entonnoir de conversion.
 */
export const PIPELINE_STAGE_ORDER: PipelineStage[] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
];

export const PIPELINE_STAGES: Record<
  PipelineStage,
  { label: string; color: string }
> = {
  prospecting: { label: 'Prospection', color: COLORS.primary[300] },
  qualification: { label: 'Qualification', color: COLORS.primary[400] },
  proposal: { label: 'Proposition', color: COLORS.primary[500] },
  negotiation: { label: 'Négociation', color: COLORS.primary[600] },
  contract_sent: { label: 'Contrat envoyé', color: COLORS.info[500] },
  closed_won: { label: 'Gagnée', color: COLORS.success[500] },
  closed_lost: { label: 'Perdue', color: COLORS.danger[500] },
};

/** Étapes considérées comme "closes", à exclure des pipelines actifs. */
export const CLOSED_PIPELINE_STAGES: PipelineStage[] = [
  'closed_won',
  'closed_lost',
];
