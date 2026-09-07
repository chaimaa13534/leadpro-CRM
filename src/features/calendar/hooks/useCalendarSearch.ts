import { useState, useCallback, useMemo, useRef } from 'react';
import type { CalendarEvent } from '@/types/calendar.types';
import type { Task } from '@/types/task.types';

interface SearchResults {
  events: CalendarEvent[];
  tasks: Task[];
  totalCount: number;
}

interface UseCalendarSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  search: (events: CalendarEvent[], tasks: Task[]) => SearchResults;
  isSearching: boolean;
}

/**
 * Hook pour la recherche instantanée dans les événements et tâches.
 * Effectue une recherche locale avec debounce.
 */
export function useCalendarSearch(debounceMs = 200): UseCalendarSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSetQuery = useCallback(
    (q: string) => {
      setQuery(q);
      setIsSearching(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsSearching(false);
      }, debounceMs);
    },
    [debounceMs],
  );

  const search = useCallback(
    (events: CalendarEvent[], tasks: Task[]): SearchResults => {
      if (!query.trim()) {
        return { events, tasks, totalCount: events.length + tasks.length };
      }

      const q = query.toLowerCase();

      const filteredEvents = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.ownerName.toLowerCase().includes(q) ||
          e.companyName?.toLowerCase().includes(q) ||
          e.contactName?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.participants.some((p) => p.name.toLowerCase().includes(q)),
      );

      const filteredTasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assigneeName?.toLowerCase().includes(q) ||
          t.relatedEntityName?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.name.toLowerCase().includes(q)),
      );

      return {
        events: filteredEvents,
        tasks: filteredTasks,
        totalCount: filteredEvents.length + filteredTasks.length,
      };
    },
    [query],
  );

  return {
    query,
    setQuery: handleSetQuery,
    search,
    isSearching,
  };
}

