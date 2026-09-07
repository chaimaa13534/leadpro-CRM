import { useState, useCallback, useEffect } from 'react';
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import { CalendarKPIs } from '@/features/calendar/components/CalendarKPIs';
import { CalendarMini } from '@/features/calendar/components/CalendarMini';
import { CalendarFilters } from '@/features/calendar/components/CalendarFilters';
import { CalendarLegend } from '@/features/calendar/components/CalendarLegend';
import { CalendarSearch } from '@/features/calendar/components/CalendarSearch';
import { EventFormModal } from '@/features/calendar/components/EventFormModal';
import { TaskFormModal } from '@/features/calendar/components/TaskFormModal';
import { TaskCard } from '@/features/calendar/components/TaskCard';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { useCalendarFilters } from '@/features/calendar/hooks/useCalendarFilters';
import { useEvents } from '@/features/calendar/hooks/useEvents';
import { useTasks } from '@/features/calendar/hooks/useTasks';
import { Icons } from '@/components/ui/icons';
import type { CalendarEvent, CalendarFilters as CalendarFiltersType } from '@/types/calendar.types';
import type { Task, TaskBoardColumn } from '@/types/task.types';

const BOARD_COLUMNS_CONFIG: { key: TaskBoardColumn; label: string; icon: keyof typeof Icons; color: string }[] = [
  { key: 'overdue', label: 'En retard', icon: 'alertTriangle', color: '#ef4444' },
  { key: 'today', label: "Aujourd'hui", icon: 'sun', color: '#f59e0b' },
  { key: 'this_week', label: 'Cette semaine', icon: 'calendar', color: '#3b82f6' },
  { key: 'done', label: 'Terminées', icon: 'checkCircle2', color: '#10b981' },
];

export function CalendarPage() {
  const { currentDate, view, setView, goToToday, goToNext, goToPrevious } = useCalendar();
  const {
    filters,
    setOwnerFilter,
    setTypeFilter,
    setPriorityFilter,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  } = useCalendarFilters();
  const { events, kpis, loading: eventsLoading, applyFilters, createEvent } = useEvents();
  const { createTask, boardColumns, loading: tasksLoading } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Apply filters whenever they change
  useEffect(() => {
    const activeFilters: Partial<CalendarFiltersType> = {};
    if (filters.ownerId) activeFilters.ownerId = filters.ownerId;
    if (filters.type) activeFilters.type = filters.type;
    if (filters.priority) activeFilters.priority = filters.priority;
    if (filters.searchQuery) activeFilters.searchQuery = filters.searchQuery;
    applyFilters(activeFilters);
  }, [filters, applyFilters]);

  const handleCreateEvent = useCallback(
    async (data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
      await createEvent(data);
    },
    [createEvent],
  );

  const handleCreateTask = useCallback(
    async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      await createTask(data);
    },
    [createTask],
  );

  return (
    <div className="space-y-6 px-4 py-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onNewEvent={() => setEventModalOpen(true)}
        onNewTask={() => setTaskModalOpen(true)}
      />

      <CalendarKPIs kpis={kpis} loading={eventsLoading} />

      <div className="flex flex-col gap-4">
        <CalendarSearch value={filters.searchQuery} onChange={setSearchQuery} />
        <CalendarFilters
          filters={filters}
          onOwnerChange={setOwnerFilter}
          onTypeChange={setTypeFilter}
          onPriorityChange={setPriorityFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 9).map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border bg-surface p-3 hover:border-border-hover transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div
                    className="mt-0.5 h-full min-h-10 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: event.color || '#5452e5' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-text-tertiary tabular-nums">
                      {new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h3 className="mt-0.5 text-[13px] font-medium text-text-primary line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-text-tertiary">
                      <span>{event.ownerName}</span>
                      {event.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-12">
              <p className="text-[14px] font-medium text-text-secondary">Aucun événement trouvé</p>
              <p className="mt-1 text-[12px] text-text-tertiary">
                {hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Créez votre premier événement'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <CalendarMini
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <CalendarLegend />
        </div>
      </div>

      {/* ── Tableau des tâches ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Icons.checkCircle2 className="size-5 text-accent" aria-hidden="true" />
          <h2 className="text-[16px] font-semibold text-text-primary">Tableau des tâches</h2>
          <span className="text-[12px] text-text-tertiary">
            {Object.values(boardColumns).reduce((sum, col) => sum + col.length, 0)} tâches
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BOARD_COLUMNS_CONFIG.map((column) => {
            const IconComponent = Icons[column.icon];
            const tasks = boardColumns[column.key];
            return (
              <div
                key={column.key}
                className="flex flex-col rounded-xl border border-border bg-surface"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <IconComponent className="size-4" style={{ color: column.color }} aria-hidden="true" />
                    <span className="text-[13px] font-medium text-text-primary">{column.label}</span>
                  </div>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-hover px-1.5 text-[11px] font-medium text-text-secondary tabular-nums">
                    {tasks.length}
                  </span>
                </div>

                {/* Column tasks */}
                <div className="flex-1 space-y-2 overflow-y-auto p-3">
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-text-tertiary">
                      <IconComponent className="size-8 mb-2 opacity-30" aria-hidden="true" />
                      <p className="text-[12px]">Aucune tâche</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard key={task.id} task={task} compact />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <EventFormModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
