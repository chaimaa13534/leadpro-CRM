import type {
  Opportunity,
  PipelineStage,
} from '@/types/opportunity.types';
import { createMockCrudService } from '@/lib/create-mock-crud-service';
import { simulateRequest } from '@/lib/simulate-request';
import { opportunitiesMock } from '@/mocks/opportunities.mock';

const crud = createMockCrudService<Opportunity>(opportunitiesMock);

export const getOpportunities = crud.getAll;
export const getOpportunityById = crud.getById;
export const createOpportunity = crud.create;
export const updateOpportunity = crud.update;
export const deleteOpportunity = crud.remove;

/** Déplace une opportunité vers une autre étape du pipeline. */
export function moveOpportunityToStage(
  id: string,
  stage: PipelineStage,
): Promise<Opportunity> {
  return crud.update(id, { stage });
}

/** Renvoie toutes les opportunités d'une étape donnée du pipeline. */
export function getOpportunitiesByStage(
  stage: PipelineStage,
): Promise<Opportunity[]> {
  const items = opportunitiesMock.filter((item) => item.stage === stage);
  return simulateRequest(items);
}

/** Met à jour la probabilité d'une opportunité. */
export function updateOpportunityProbability(
  id: string,
  probability: number,
): Promise<Opportunity> {
  return crud.update(id, { probability });
}

/** Récupère les opportunités pour un contact spécifique. */
export function getOpportunitiesByContact(
  contactId: string,
): Promise<Opportunity[]> {
  const items = opportunitiesMock.filter(
    (item) => item.contactId === contactId,
  );
  return simulateRequest(items);
}

/** Récupère les opportunités pour une entreprise spécifique. */
export function getOpportunitiesByCompany(
  companyId: string,
): Promise<Opportunity[]> {
  const items = opportunitiesMock.filter(
    (item) => item.companyId === companyId,
  );
  return simulateRequest(items);
}

