import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Contact, ContactStatus } from '@/types/contact.types';
import { getContacts, deleteContact as deleteContactRequest } from '@/services/contact.service';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination.constants';

export type ContactDateRangeFilter = 'all' | '7d' | '30d' | '90d';

export interface ContactFilters {
  company: string;
  city: string;
  country: string;
  status: ContactStatus | 'all';
  ownerId: string | 'all';
  dateRange: ContactDateRangeFilter;
}

export type ContactSortField = 'name' | 'company' | 'city' | 'date';
export type SortOrder = 'asc' | 'desc';

export interface ContactSortState {
  field: ContactSortField;
  order: SortOrder;
}

const DEFAULT_FILTERS: ContactFilters = {
  company: '',
  city: '',
  country: '',
  status: 'all',
  ownerId: 'all',
  dateRange: 'all',
};

const DATE_RANGE_DAYS: Record<Exclude<ContactDateRangeFilter, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

function matchesSearch(contact: Contact, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    contact.firstName,
    contact.lastName,
    contact.company ?? '',
    contact.email,
    contact.phone ?? '',
    contact.city ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

function matchesFilters(contact: Contact, filters: ContactFilters): boolean {
  if (filters.company && (contact.company ?? '').toLowerCase() !== filters.company.toLowerCase()) {
    return false;
  }
  if (filters.city && (contact.city ?? '').toLowerCase() !== filters.city.toLowerCase()) {
    return false;
  }
  if (filters.country && (contact.country ?? '').toLowerCase() !== filters.country.toLowerCase()) {
    return false;
  }
  if (filters.status !== 'all' && contact.status !== filters.status) {
    return false;
  }
  if (filters.ownerId !== 'all' && contact.ownerId !== filters.ownerId) {
    return false;
  }
  if (filters.dateRange !== 'all') {
    const days = DATE_RANGE_DAYS[filters.dateRange];
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    if (new Date(contact.createdAt).getTime() < threshold) {
      return false;
    }
  }
  return true;
}

function compareContacts(a: Contact, b: Contact, sort: ContactSortState): number {
  const comparison =
    sort.field === 'name'
      ? `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        )
      : sort.field === 'company'
        ? (a.company ?? '').localeCompare(b.company ?? '')
        : sort.field === 'city'
          ? (a.city ?? '').localeCompare(b.city ?? '')
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return sort.order === 'asc' ? comparison : -comparison;
}

export function useContactsTable() {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ContactFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<ContactSortState>({
    field: 'date',
    order: 'desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [resetCounter, setResetCounter] = useState(0);

  const fetchContacts = useCallback(() => {
    return getContacts({ page: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        setAllContacts(result.items);
        setError(null);
      })
      .catch(() => {
        setError('Impossible de charger les contacts. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchContacts();
  }, [fetchContacts]);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const updateFilters = useCallback((value: ContactFilters) => {
    setFilters(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: ContactSortState) => {
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

  const filteredContacts = useMemo(() => {
    return allContacts.filter(
      (contact) =>
        matchesSearch(contact, searchQuery) && matchesFilters(contact, filters),
    );
  }, [allContacts, searchQuery, filters]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => compareContacts(a, b, sort));
  }, [filteredContacts, sort]);

  const totalItems = sortedContacts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedContacts.slice(start, start + pageSize);
  }, [sortedContacts, currentPage, pageSize]);

  const deleteContact = useCallback(async (id: string) => {
    await deleteContactRequest(id);
    setAllContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, []);

  return {
    contacts: paginatedContacts,
    allContacts,
    allContactsCount: allContacts.length,
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
    deleteContact,
    refresh,
    resetFilters,
    resetCounter,
  };
}

