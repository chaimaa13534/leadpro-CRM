import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Opportunity, PipelineStage, OpportunityPriority, OpportunityStatus } from '@/types/opportunity.types';
import { getOpportunities, deleteOpportunity as deleteOpportunityRequest } from '@/services/opportunity.service';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination.constants';

export type OpportunityDateRangeFilter = 'all' | '7d' | '30d' | '90d';

export interface OpportunityFilters {
  stage: PipelineStage | 'all';
  ownerId: string | 'all';
  companyId: string | 'all';
  status: OpportunityStatus | 'all';
  priority: OpportunityPriority | 'all';
  probabilityRange: 'all' | '0-25' | '26-50' | '51-75' | '76-100';
  amountRange: 'all' | '0-50k' | '50k-200k' | '200k-500k' | '500k+';
  dateRange: OpportunityDateRangeFilter;
}

export type OpportunitySortField =
  | 'name'
  | 'amount'
  | 'probability'
  | 'expectedCloseDate'
  | 'companyName'
  | 'lastActivity'
  | 'createdAt';

export type SortOrder = 'asc' | 'desc';

export interface OpportunitySortState {
  field: OpportunitySortField;
  order: SortOrder;
}

const DEFAULT_FILTERS: OpportunityFilters = {
  stage: 'all',
  ownerId: 'all',
  companyId: 'all',
  status: 'all',
  priority: 'all',
  probabilityRange: 'all',
  amountRange: 'all',
  dateRange: 'all',
};

const DATE_RANGE_DAYS: Record<Exclude<OpportunityDateRangeFilter, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function matchesSearch(opportunity: Opportunity, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    opportunity.name,
    opportunity.companyName ?? '',
    opportunity.contactName ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

function matchesFilters(opportunity: Opportunity, filters: OpportunityFilters): boolean {
  if (filters.stage !== 'all' && opportunity.stage !== filters.stage) return false;
  if (filters.ownerId !== 'all' && opportunity.ownerId !== filters.ownerId) return false;
  if (filters.companyId !== 'all' && opportunity.companyId !== filters.companyId) return false;
  if (filters.status !== 'all' && opportunity.status !== filters.status) return false;
  if (filters.priority !== 'all' && opportunity.priority !== filters.priority) return false;

  if (filters.probabilityRange !== 'all') {
    const ranges: Record<string, [number, number]> = {
      '0-25': [0, 25],
      '26-50': [26, 50],
      '51-75': [51, 75],
      '76-100': [76, 100],
    };
    const [min, max] = ranges[filters.probabilityRange] ?? [0, 100];
    if (opportunity.probability < min || opportunity.probability > max) return false;
  }

  if (filters.amountRange !== 'all') {
    const ranges: Record<string, [number, number]> = {
      '0-50k': [0, 50000],
      '50k-200k': [50001, 200000],
      '200k-500k': [200001, 500000],
      '500k+': [500001, Infinity],
    };
    const [min, max] = ranges[filters.amountRange] ?? [0, Infinity];
    if (opportunity.amount < min || opportunity.amount > max) return false;
  }

  if (filters.dateRange !== 'all') {
    const days = DATE_RANGE_DAYS[filters.dateRange];
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    if (new Date(opportunity.createdAt).getTime() < threshold) return false;
  }

  return true;
}

function compareOpportunities(
  a: Opportunity,
  b: Opportunity,
  sort: OpportunitySortState,
): number {
  let comparison = 0;

  switch (sort.field) {
    case 'name':
      comparison = a.name.localeCompare(b.name);
      break;
    case 'amount':
      comparison = a.amount - b.amount;
      break;
    case 'probability':
      comparison = a.probability - b.probability;
      break;
    case 'expectedCloseDate':
      comparison =
        (a.expectedCloseDate ?? '').localeCompare(b.expectedCloseDate ?? '');
      break;
    case 'companyName':
      comparison = (a.companyName ?? '').localeCompare(b.companyName ?? '');
      break;
    case 'lastActivity':
      comparison =
        (a.lastActivityAt ?? '').localeCompare(b.lastActivityAt ?? '');
      break;
    case 'createdAt':
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      break;
  }

  return sort.order === 'asc' ? comparison : -comparison;
}

export function useOpportunitiesTable() {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OpportunityFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<OpportunitySortState>({
    field: 'createdAt',
    order: 'desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [resetCounter, setResetCounter] = useState(0);

  const fetchOpportunities = useCallback(() => {
    return getOpportunities({ page: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        setAllOpportunities(result.items);
        setError(null);
      })
      .catch(() => {
        setError('Impossible de charger les opportunités. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchOpportunities();
  }, [fetchOpportunities]);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const updateFilters = useCallback((value: OpportunityFilters) => {
    setFilters(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: OpportunitySortState) => {
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

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(
      (opp) =>
        matchesSearch(opp, searchQuery) && matchesFilters(opp, filters),
    );
  }, [allOpportunities, searchQuery, filters]);

  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) =>
      compareOpportunities(a, b, sort),
    );
  }, [filteredOpportunities, sort]);

  const totalItems = sortedOpportunities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOpportunities.slice(start, start + pageSize);
  }, [sortedOpportunities, currentPage, pageSize]);

  const deleteOpportunity = useCallback(async (id: string) => {
    await deleteOpportunityRequest(id);
    setAllOpportunities((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return {
    opportunities: paginatedOpportunities,
    allOpportunities,
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
    deleteOpportunity,
    refresh,
    resetFilters,
    resetCounter,
  };
}

