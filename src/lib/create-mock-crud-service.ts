import type { PaginatedResult, PaginationParams } from '@/types/common.types';
import {
  simulateRequest,
  simulateRequestFailure,
} from '@/lib/simulate-request';
import { generateId } from '@/utils/generateId';

interface EntityWithId {
  id: string;
}

/**
 * Fabrique un service CRUD simulé et générique, adossé à un tableau en
 * mémoire. Chaque service de domaine (`lead.service.ts`,
 * `contact.service.ts`…) s'appuie dessus pour éviter de dupliquer la même
 * logique de pagination / création / mise à jour / suppression.
 *
 * Le tableau passé en paramètre est manipulé par référence, ce qui permet
 * à tous les appels d'un même service de rester cohérents entre eux au
 * sein d'une session (créer puis relire l'élément créé, par exemple).
 *
 * Cette couche sera remplacée par de vrais appels HTTP plus tard ; les
 * signatures (toutes basées sur des `Promise`) ne changeront pas.
 */
export function createMockCrudService<T extends EntityWithId>(records: T[]) {
  function getAll(
    params?: Partial<PaginationParams>,
  ): Promise<PaginatedResult<T>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? Math.max(records.length, 1);
    const start = (page - 1) * pageSize;
    const items = records.slice(start, start + pageSize);

    return simulateRequest({
      items,
      page,
      pageSize,
      totalItems: records.length,
      totalPages: Math.max(1, Math.ceil(records.length / pageSize)),
    });
  }

  function getById(id: string): Promise<T | null> {
    const record = records.find((item) => item.id === id) ?? null;
    return simulateRequest(record);
  }

  function create(input: Omit<T, 'id'>): Promise<T> {
    const record = { ...input, id: generateId() } as T;
    records.push(record);
    return simulateRequest(record);
  }

  function update(id: string, changes: Partial<Omit<T, 'id'>>): Promise<T> {
    const index = records.findIndex((item) => item.id === id);
    const existing = records[index];

    if (index === -1 || !existing) {
      return simulateRequestFailure(
        `Aucun enregistrement trouvé pour l'id "${id}".`,
      );
    }

    const updated = { ...existing, ...changes } as T;
    records[index] = updated;
    return simulateRequest(updated);
  }

  function remove(id: string): Promise<void> {
    const index = records.findIndex((item) => item.id === id);

    if (index === -1) {
      return simulateRequestFailure(
        `Aucun enregistrement trouvé pour l'id "${id}".`,
      );
    }

    records.splice(index, 1);
    return simulateRequest(undefined);
  }

  return { getAll, getById, create, update, remove };
}
