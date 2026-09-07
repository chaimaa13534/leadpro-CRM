import { useState, useCallback } from 'react';
import type { CalendarFilters as CalendarFiltersType, EventType, EventPriority } from '@/types/calendar.types';
import type { ID } from '@/types/common.types';

interface UseCalendarFiltersReturn {
  filters: CalendarFiltersType;
  setOwnerFilter: (ownerId: ID | null) => void;
  setCompanyFilter: (companyId: ID | null) => void;
  setContactFilter: (contactId: ID | null) => void;
  setTypeFilter: (type: EventType | null) => void;
  setPriorityFilter: (priority: EventPriority | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: CalendarFiltersType = {
  ownerId: null,
  companyId: null,
  contactId: null,
  type: null,
  priority: null,
  searchQuery: '',
};

/**
 * Hook pour gérer l'état des filtres du calendrier.
 * Centralise la logique de filtrage pour CalendarFilters et CalendarSearch.
 */
export function useCalendarFilters(): UseCalendarFiltersReturn {
  const [filters, setFilters] = useState<CalendarFiltersType>(defaultFilters);

  const setOwnerFilter = useCallback((ownerId: ID | null) => {
    setFilters((prev) => ({ ...prev, ownerId }));
  }, []);

  const setCompanyFilter = useCallback((companyId: ID | null) => {
    setFilters((prev) => ({ ...prev, companyId }));
  }, []);

  const setContactFilter = useCallback((contactId: ID | null) => {
    setFilters((prev) => ({ ...prev, contactId }));
  }, []);

  const setTypeFilter = useCallback((type: EventType | null) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const setPriorityFilter = useCallback((priority: EventPriority | null) => {
    setFilters((prev) => ({ ...prev, priority }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters =
    filters.ownerId !== null ||
    filters.companyId !== null ||
    filters.contactId !== null ||
    filters.type !== null ||
    filters.priority !== null ||
    filters.searchQuery !== '';

  return {
    filters,
    setOwnerFilter,
    setCompanyFilter,
    setContactFilter,
    setTypeFilter,
    setPriorityFilter,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  };
}

