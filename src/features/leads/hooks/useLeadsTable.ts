import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Lead, LeadSource, LeadStatus } from '@/types/lead.types';
import {
  getLeads,
  deleteLead as deleteLeadRequest,
} from '@/services/lead.service';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination.constants';

export type LeadDateRangeFilter = 'all' | '7d' | '30d' | '90d';

export interface LeadFilters {
  status: LeadStatus | 'all';
  source: LeadSource | 'all';
  ownerId: string | 'all';
  dateRange: LeadDateRangeFilter;
}

export type LeadSortField = 'name' | 'company' | 'date';
export type SortOrder = 'asc' | 'desc';

export interface LeadSortState {
  field: LeadSortField;
  order: SortOrder;
}

const DEFAULT_FILTERS: LeadFilters = {
  status: 'all',
  source: 'all',
  ownerId: 'all',
  dateRange: 'all',
};

const DATE_RANGE_DAYS: Record<Exclude<LeadDateRangeFilter, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function matchesSearch(lead: Lead, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    lead.firstName,
    lead.lastName,
    lead.companyName ?? '',
    lead.email,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

function matchesFilters(lead: Lead, filters: LeadFilters): boolean {
  if (filters.status !== 'all' && lead.status !== filters.status) {
    return false;
  }
  if (filters.source !== 'all' && lead.source !== filters.source) {
    return false;
  }
  if (filters.ownerId !== 'all' && lead.ownerId !== filters.ownerId) {
    return false;
  }
  if (filters.dateRange !== 'all') {
    const days = DATE_RANGE_DAYS[filters.dateRange];
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    if (new Date(lead.createdAt).getTime() < threshold) {
      return false;
    }
  }
  return true;
}

function compareLeads(a: Lead, b: Lead, sort: LeadSortState): number {
  const comparison =
    sort.field === 'name'
      ? `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        )
      : sort.field === 'company'
        ? (a.companyName ?? '').localeCompare(b.companyName ?? '')
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return sort.order === 'asc' ? comparison : -comparison;
}

/**
 * Centralise tout l'état de la page Leads : chargement des données
 * (simulé), recherche, filtres, tri et pagination — le tout appliqué
 * côté client sur l'ensemble des leads récupéré une seule fois. Cohérent
 * avec l'échelle du projet aujourd'hui (données mockées) ; le jour où de
 * vraies API existeront, seule `fetchLeads` ci-dessous changera.
 *
 * Remettre la pagination à la page 1 quand la recherche/un filtre/le tri
 * change est fait directement dans les setters exposés (`updateXxx`)
 * plutôt que via un `useEffect` séparé qui observerait ces valeurs : ça
 * évite un rendu en cascade et reste conforme à
 * `react-hooks/set-state-in-effect`.
 */
export function useLeadsTable() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<LeadSortState>({
    field: 'date',
    order: 'desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [resetCounter, setResetCounter] = useState(0);

  const fetchLeads = useCallback(() => {
    return getLeads({ page: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        setAllLeads(result.items);
        setError(null);
      })
      .catch(() => {
        setError('Impossible de charger les leads. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Chargement initial : `isLoading` démarre déjà à `true` (état
  // initial), donc aucun `setState` synchrone n'est nécessaire ici —
  // seuls les callbacks de la promesse (asynchrones) mettent à jour
  // l'état, ce que la règle `react-hooks/set-state-in-effect` autorise.
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchLeads();
  }, [fetchLeads]);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const updateFilters = useCallback((value: LeadFilters) => {
    setFilters(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: LeadSortState) => {
    setSort(value);
    setPage(1);
  }, []);

  const updatePageSize = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setResetCounter((prev) => prev + 1);
  }, []);

  const filteredLeads = useMemo(() => {
    return allLeads.filter(
      (lead) =>
        matchesSearch(lead, searchQuery) && matchesFilters(lead, filters),
    );
  }, [allLeads, searchQuery, filters]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => compareLeads(a, b, sort));
  }, [filteredLeads, sort]);

  const totalItems = sortedLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  const deleteLead = useCallback(async (id: string) => {
    await deleteLeadRequest(id);
    setAllLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  return {
    leads: paginatedLeads,
    allLeads,
    allLeadsCount: allLeads.length,
    totalItems,
    totalPages,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: updatePageSize,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    filters,
    setFilters: updateFilters,
    sort,
    setSort: updateSort,
    deleteLead,
    refresh,
    resetFilters,
    resetCounter,
  };
}
