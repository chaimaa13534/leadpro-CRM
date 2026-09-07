import type { Company } from '@/types/company.types';
import { createMockCrudService } from '@/lib/create-mock-crud-service';
import { simulateRequest } from '@/lib/simulate-request';
import { companiesMock } from '@/mocks/companies.mock';

const crud = createMockCrudService<Company>(companiesMock);

export const getCompanies = crud.getAll;
export const getCompanyById = crud.getById;
export const createCompany = crud.create;
export const updateCompany = crud.update;
export const deleteCompany = crud.remove;

/** Recherche d'entreprises multi-champs (nom, secteur, ville, pays, responsable). */
export function searchCompanies(query: string): Promise<Company[]> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return simulateRequest(companiesMock);
  }

  const items = companiesMock.filter((company) => {
    const haystack = [
      company.name,
      company.industry ?? '',
      company.city ?? '',
      company.country ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return simulateRequest(items);
}
