/* ═════════════════════════════════════════════════════════════════════
   Activity Center — Hook
   ═════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import type { Activity, ActivityFilter, ActivityGroup } from '@/types/activity.types';
import { getActivityGroups } from '@/features/notifications/services/notifications.service';
import { getActivityStats } from '@/features/notifications/mocks/notifications.mock';
import type { ActivityStats } from '@/features/notifications/types/notifications.types';

interface UseActivitiesReturn {
  groups: ActivityGroup[];
  stats: ActivityStats;
  loading: boolean;
  error: string | null;
  filters: Partial<ActivityFilter>;
  page: number;
  totalPages: number;
  total: number;
  setFilters: Dispatch<SetStateAction<Partial<ActivityFilter>>>;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

export function useActivities(): UseActivitiesReturn {
  const [groups, setGroups] = useState<ActivityGroup[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    byModule: {},
    byType: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<ActivityFilter>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const mountedRef = useRef(true);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getActivityGroups(filters, page, 30);
      if (mountedRef.current) {
        setGroups(result.groups);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      }
    } catch {
      if (mountedRef.current) {
        setError('Erreur lors du chargement des activités');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { activitiesMock: acts, getActivityStats: statsFn } = await import(
        '@/features/notifications/mocks/notifications.mock'
      );
      if (mountedRef.current) {
        setStats(statsFn(acts));
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchActivities();
    fetchStats();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchActivities, fetchStats]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchActivities(), fetchStats()]);
  }, [fetchActivities, fetchStats]);

  return useMemo(
    () => ({
      groups,
      stats,
      loading,
      error,
      filters,
      page,
      totalPages,
      total,
      setFilters,
      setPage,
      refresh,
    }),
    [groups, stats, loading, error, filters, page, totalPages, total, setFilters, setPage, refresh],
  );
}

