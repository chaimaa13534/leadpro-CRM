import { useState, useMemo, useCallback } from 'react';
import type { CalendarView } from '@/types/calendar.types';

interface UseCalendarReturn {
  currentDate: Date;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  goToToday: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToDate: (date: Date) => void;
  /** Formatted label for the current view */
  viewLabel: string;
}

/**
 * Hook principal pour la navigation du calendrier.
 * Gère la date courante et le changement de vues (Day / Week / Month / Agenda).
 */
export function useCalendar(initialView: CalendarView = 'month'): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>(initialView);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      switch (view) {
        case 'day':
          next.setDate(next.getDate() + 1);
          break;
        case 'week':
          next.setDate(next.getDate() + 7);
          break;
        case 'month':
          next.setMonth(next.getMonth() + 1);
          break;
        case 'agenda':
          next.setDate(next.getDate() + 7);
          break;
      }
      return next;
    });
  }, [view]);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      switch (view) {
        case 'day':
          next.setDate(next.getDate() - 1);
          break;
        case 'week':
          next.setDate(next.getDate() - 7);
          break;
        case 'month':
          next.setMonth(next.getMonth() - 1);
          break;
        case 'agenda':
          next.setDate(next.getDate() - 7);
          break;
      }
      return next;
    });
  }, [view]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const viewLabel = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    if (view === 'day') {
      return currentDate.toLocaleDateString('fr-FR', { ...options, day: 'numeric' });
    }
    if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const startStr = weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      const endStr = weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    return currentDate.toLocaleDateString('fr-FR', options);
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    setView,
    goToToday,
    goToNext,
    goToPrevious,
    goToDate,
    viewLabel,
  };
}

