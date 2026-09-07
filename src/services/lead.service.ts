import type { Lead, LeadStatus } from '@/types/lead.types';
import { createMockCrudService } from '@/lib/create-mock-crud-service';
import { simulateRequest } from '@/lib/simulate-request';
import { leadsMock } from '@/mocks/leads.mock';

const crud = createMockCrudService<Lead>(leadsMock);

export const getLeads = crud.getAll;
export const getLeadById = crud.getById;
export const createLead = crud.create;
export const updateLead = crud.update;
export const deleteLead = crud.remove;

/** Met à jour uniquement le statut d'un lead (ex: glisser-déposer Kanban). */
export function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead> {
  return crud.update(id, { status });
}

/** Renvoie les leads appartenant à un commercial donné. */
export function getLeadsByOwner(ownerId: string): Promise<Lead[]> {
  const items = leadsMock.filter((lead) => lead.ownerId === ownerId);
  return simulateRequest(items);
}
