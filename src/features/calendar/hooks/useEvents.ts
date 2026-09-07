import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent, CalendarFilters, CalendarKPI } from '@/types/calendar.types';
import { calendarService } from '@/features/calendar/services/calendar.service';

interface UseEventsReturn {
  events: CalendarEvent[];
  kpis: CalendarKPI[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  applyFilters: (filters: Partial<CalendarFilters>) => Promise<void>;
  createEvent: (input: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CalendarEvent | null>;
  updateEvent: (id: string, changes: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<CalendarEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  getEventById: (id: string) => CalendarEvent | undefined;
}

/**
 * Hook pour la gestion des événements du calendrier.
 * Charge les événements, permet le filtrage, la création, modification et suppression.
 */
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [kpis, setKpis] = useState<CalendarKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedEvents, fetchedKpis] = await Promise.all([
        calendarService.getEvents(),
        calendarService.getKPIs(),
      ]);
      setEvents(fetchedEvents);
      setKpis(fetchedKpis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const applyFilters = useCallback(async (filters: Partial<CalendarFilters>) => {
    setLoading(true);
    try {
      const filtered = await calendarService.filterEvents(filters);
      setEvents(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du filtrage');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (input: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEvent = await calendarService.createEvent(input);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return null;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, changes: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updated = await calendarService.updateEvent(id, changes);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return null;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  }, []);

  const getEventById = useCallback((id: string) => {
    return events.find((e) => e.id === id);
  }, [events]);

  return {
    events,
    kpis,
    loading,
    error,
    refresh,
    applyFilters,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  };
}

