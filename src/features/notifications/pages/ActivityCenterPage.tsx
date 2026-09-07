/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivityCenterPage
   Full page with timeline, filters, search, sidebar, and pagination
   ═════════════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { ActivityTimeline } from '@/features/notifications/components/ActivityTimeline';
import { ActivityFilters } from '@/features/notifications/components/ActivityFilters';
import { ActivitySearch } from '@/features/notifications/components/ActivitySearch';
import { ActivitySidebar } from '@/features/notifications/components/ActivitySidebar';
import { useActivities } from '@/features/notifications/hooks/useActivities';
import { pageTransitionVariants } from '@/lib/motion-variants';
import type { ActivityFilter } from '@/types/activity.types';

export function ActivityCenterPage() {
  const {
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
  } = useActivities();

  const handleResetFilters = useCallback(() => {
    setFilters({ searchQuery: '' });
  }, [setFilters]);

  const handleFilterChange = useCallback(
    <K extends keyof ActivityFilter>(key: K, value: ActivityFilter[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [setFilters, setPage],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
      setPage(1);
    },
    [setFilters, setPage],
  );

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8"
    >
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface-hover text-accent">
            <History className="size-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">
              Centre d'Activités
            </h1>
            <p className="mt-1 text-[13px] text-text-tertiary">
              Timeline complète des activités CRM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-text-tertiary tabular-nums">
            {total} activité{total > 1 ? 's' : ''}
          </span>
          <Button variant="secondary" size="sm" onClick={refresh} loading={loading}>
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col gap-3">
        <ActivityFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <div className="max-w-md">
          <ActivitySearch
            value={filters.searchQuery ?? ''}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Timeline */}
        <div className="flex-1 min-w-0">
          <ActivityTimeline
            groups={groups}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </div>

        {/* Sidebar with stats */}
        <div className="hidden lg:block">
          <ActivitySidebar stats={stats} />
        </div>
      </div>
    </motion.div>
  );
}

