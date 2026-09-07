/**
 * Primitives partagés entre plusieurs modèles du domaine.
 * Garder ce fichier volontairement minimal : il ne doit contenir que des
 * types transverses, jamais de logique métier spécifique à une feature.
 */

/** Identifiant unique, sous forme de chaîne (UUID côté backend). */
export type ID = string;

/** Chaîne ISO 8601 (ex: "2026-07-16T10:00:00.000Z"). */
export type ISODateString = string;

/**
 * Enveloppe standard pour toute réponse paginée renvoyée par les services.
 */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Paramètres génériques de pagination envoyés aux services. */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Ordre de tri générique, réutilisable par tous les services de liste. */
export type SortOrder = 'asc' | 'desc';

export interface SortParams<TField extends string = string> {
  field: TField;
  order: SortOrder;
}

/**
 * Enveloppe d'erreur normalisée, utilisée par la couche `services/` pour
 * uniformiser les erreurs quelle que soit leur source (réseau, validation…).
 */
export interface AppError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}
