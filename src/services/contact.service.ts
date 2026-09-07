import type { Contact } from '@/types/contact.types';
import { createMockCrudService } from '@/lib/create-mock-crud-service';
import { simulateRequest } from '@/lib/simulate-request';
import { contactsMock } from '@/mocks/contacts.mock';

const crud = createMockCrudService<Contact>(contactsMock);

export const getContacts = crud.getAll;
export const getContactById = crud.getById;
export const createContact = crud.create;
export const updateContact = crud.update;
export const deleteContact = crud.remove;

/** Renvoie tous les contacts rattachés à une entreprise donnée. */
export function getContactsByCompany(companyId: string): Promise<Contact[]> {
  const items = contactsMock.filter(
    (contact) => contact.companyId === companyId,
  );
  return simulateRequest(items);
}

/** Renvoie les contacts appartenant à un responsable donné. */
export function getContactsByOwner(ownerId: string): Promise<Contact[]> {
  const items = contactsMock.filter(
    (contact) => contact.ownerId === ownerId,
  );
  return simulateRequest(items);
}
