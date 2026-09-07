import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Company, CompanyStatus } from '@/types/company.types';
import {
  getCompanies,
  deleteCompany as deleteCompanyRequest,
} from '@/services/company.service';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination.constants';

export type CompanyDateRangeFilter = 'all' | '7d' | '30d' | '90d';

export interface CompanyFilters {
  industry: string;
  country: string;
  city: string;
  status: CompanyStatus | 'all';
  ownerId: string | 'all';
  dateRange: CompanyDateRangeFilter;
}

export type CompanySortField =
  | 'name'
  | 'industry'
  | 'date'
  | 'value'
  | 'contacts';

export type SortOrder = 'asc' | 'desc';

export interface CompanySortState {
  field: CompanySortField;
  order: SortOrder;
}

const DEFAULT_FILTERS: CompanyFilters = {
  industry: '',
  country: '',
  city: '',
  status: 'all',
  ownerId: 'all',
  dateRange: 'all',
};

const DATE_RANGE_DAYS: Record<
  Exclude<CompanyDateRangeFilter, 'all'>,
  number
> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function matchesSearch(company: Company, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    company.name,
    company.industry ?? '',
    company.city ?? '',
    company.country ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

function matchesFilters(company: Company, filters: CompanyFilters): boolean {
  if (
    filters.industry &&
    (company.industry ?? '').toLowerCase() !== filters.industry.toLowerCase()
  ) {
    return false;
  }
  if (
    filters.city &&
    (company.city ?? '').toLowerCase() !== filters.city.toLowerCase()
  ) {
    return false;
  }
  if (
    filters.country &&
    (company.country ?? '').toLowerCase() !== filters.country.toLowerCase()
  ) {
    return false;
  }
  if (filters.status !== 'all' && company.status !== filters.status) {
    return false;
  }
  if (filters.ownerId !== 'all' && company.ownerId !== filters.ownerId) {
    return false;
  }
  if (filters.dateRange !== 'all') {
    const days = DATE_RANGE_DAYS[filters.dateRange];
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    if (new Date(company.createdAt).getTime() < threshold) {
      return false;
    }
  }
  return true;
}

function compareCompanies(
  a: Company,
  b: Company,
  sort: CompanySortState,
): number {
  let comparison = 0;

  switch (sort.field) {
    case 'name':
      comparison = a.name.localeCompare(b.name);
      break;
    case 'industry':
      comparison = (a.industry ?? '').localeCompare(b.industry ?? '');
      break;
    case 'date':
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      break;
    case 'value':
      comparison = (a.estimatedRevenue ?? 0) - (b.estimatedRevenue ?? 0);
      break;
    case 'contacts':
      comparison =
        a.linkedContactIds.length - b.linkedContactIds.length;
      break;
  }

  return sort.order === 'asc' ? comparison : -comparison;
}

export function useCompaniesTable() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CompanyFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<CompanySortState>({
    field: 'date',
    order: 'desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [resetCounter, setResetCounter] = useState(0);

  const fetchCompanies = useCallback(() => {
    return getCompanies({ page: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        setAllCompanies(result.items);
        setError(null);
      })
      .catch(() => {
        setError(
          'Impossible de charger les entreprises. Veuillez réessayer.',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchCompanies();
  }, [fetchCompanies]);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const updateFilters = useCallback((value: CompanyFilters) => {
    setFilters(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: CompanySortState) => {
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

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter(
      (company) =>
        matchesSearch(company, searchQuery) &&
        matchesFilters(company, filters),
    );
  }, [allCompanies, searchQuery, filters]);

  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) =>
      compareCompanies(a, b, sort),
    );
  }, [filteredCompanies, sort]);

  const totalItems = sortedCompanies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCompanies.slice(start, start + pageSize);
  }, [sortedCompanies, currentPage, pageSize]);

  const deleteCompany = useCallback(async (id: string) => {
    await deleteCompanyRequest(id);
    setAllCompanies((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    companies: paginatedCompanies,
    allCompanies,
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
    deleteCompany,
    refresh,
    resetFilters,
    resetCounter,
  };
}

