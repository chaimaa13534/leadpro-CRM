/**
 * Service simulé pour le Pipeline Kanban.
 * Prêt à être connecté à un backend REST ou GraphQL.
 */
import type { Opportunity, PipelineStage } from '@/types/opportunity.types';
import { PIPELINE_OPPORTUNITIES, getPipelineQuickDetails } from '@/features/pipeline/mocks/pipeline.mock';
import { simulateRequest } from '@/lib/simulate-request';
import type { PipelineQuickDetails } from '@/features/pipeline/mocks/pipeline.mock';

/** Données du board en mémoire */
let boardData: Opportunity[] = [...PIPELINE_OPPORTUNITIES];

/**
 * Récupère toutes les opportunités du pipeline.
 */
export function getPipelineOpportunities(): Promise<Opportunity[]> {
  return simulateRequest([...boardData]);
}

/**
 * Déplace une opportunité vers une nouvelle étape.
 * Simule une mutation backend.
 */
export function moveOpportunityStage(
  opportunityId: string,
  newStage: PipelineStage,
): Promise<Opportunity> {
  const index = boardData.findIndex((opp) => opp.id === opportunityId);
  if (index === -1) {
    return Promise.reject(new Error(`Opportunité ${opportunityId} introuvable`));
  }
  const updated = {
    ...boardData[index]!,
    stage: newStage,
    updatedAt: new Date().toISOString(),
    probability: recalculateProbability(newStage, boardData[index]!.probability),
  };
  boardData[index] = updated;
  return simulateRequest(updated);
}

/**
 * Met à jour les données d'une opportunité (probabilité, priorité, etc.).
 */
export function updateOpportunityField<K extends keyof Opportunity>(
  opportunityId: string,
  field: K,
  value: Opportunity[K],
): Promise<Opportunity> {
  const index = boardData.findIndex((opp) => opp.id === opportunityId);
  if (index === -1) {
    return Promise.reject(new Error(`Opportunité ${opportunityId} introuvable`));
  }
  const updated = {
    ...boardData[index]!,
    [field]: value,
    updatedAt: new Date().toISOString(),
  };
  boardData[index] = updated;
  return simulateRequest(updated);
}

/**
 * Récupère les détails rapides pour une opportunité (drawer).
 */
export function getOpportunityQuickDetails(
  opportunityId: string,
): Promise<PipelineQuickDetails | null> {
  const opp = boardData.find((o) => o.id === opportunityId);
  if (!opp) return simulateRequest(null);
  return simulateRequest(getPipelineQuickDetails(opp));
}

/**
 * Recherche des opportunités par texte (nom, entreprise, commercial, contact).
 */
export function searchPipelineOpportunities(
  query: string,
): Promise<Opportunity[]> {
  const q = query.toLowerCase().trim();
  if (!q) return simulateRequest([...boardData]);

  const filtered = boardData.filter(
    (opp) =>
      opp.name.toLowerCase().includes(q) ||
      (opp.companyName ?? '').toLowerCase().includes(q) ||
      (opp.contactName ?? '').toLowerCase().includes(q) ||
      opp.ownerId.toLowerCase().includes(q),
  );
  return simulateRequest(filtered);
}

/**
 * Filtre les opportunités selon plusieurs critères.
 */
export function filterPipelineOpportunities(
  filters: {
    ownerId?: string;
    pipeline?: string;
    stage?: PipelineStage;
    priority?: string;
    companyName?: string;
    probabilityMin?: number;
    probabilityMax?: number;
    valueMin?: number;
    valueMax?: number;
  },
): Promise<Opportunity[]> {
  let filtered = [...boardData];

  if (filters.ownerId && filters.ownerId !== 'all') {
    filtered = filtered.filter((o) => o.ownerId === filters.ownerId);
  }
  if (filters.pipeline && filters.pipeline !== 'all') {
    filtered = filtered.filter((o) => o.pipeline === filters.pipeline);
  }
  if (filters.stage) {
    filtered = filtered.filter((o) => o.stage === filters.stage);
  }
  if (filters.priority) {
    filtered = filtered.filter((o) => o.priority === filters.priority);
  }
  if (filters.companyName) {
    filtered = filtered.filter((o) => o.companyName === filters.companyName);
  }
  const probabilityMin = filters.probabilityMin;
  const probabilityMax = filters.probabilityMax;
  const valueMin = filters.valueMin;
  const valueMax = filters.valueMax;

  if (typeof probabilityMin === 'number') {
    filtered = filtered.filter((o) => o.probability >= probabilityMin);
  }
  if (typeof probabilityMax === 'number') {
    filtered = filtered.filter((o) => o.probability <= probabilityMax);
  }
  if (typeof valueMin === 'number') {
    filtered = filtered.filter((o) => o.amount >= valueMin);
  }
  if (typeof valueMax === 'number') {
    filtered = filtered.filter((o) => o.amount <= valueMax);
  }

  return simulateRequest(filtered);
}

/**
 * Réinitialise les données du board.
 */
export function resetPipelineData(): Promise<Opportunity[]> {
  boardData = [...PIPELINE_OPPORTUNITIES];
  return simulateRequest([...boardData]);
}

/**
 * Recalcule la probabilité en fonction de l'étape.
 */
function recalculateProbability(stage: PipelineStage, currentProb: number): number {
  const ranges: Record<PipelineStage, [number, number]> = {
    prospecting: [5, 20],
    qualification: [20, 40],
    proposal: [40, 60],
    negotiation: [60, 80],
    contract_sent: [80, 95],
    closed_won: [100, 100],
    closed_lost: [0, 0],
  };
  const [min, max] = ranges[stage];
  if (currentProb >= min && currentProb <= max) return currentProb;
  return min + Math.floor(Math.random() * (max - min));
}

