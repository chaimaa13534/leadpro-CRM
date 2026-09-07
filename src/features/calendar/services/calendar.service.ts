import type { CalendarEvent, CalendarKPI, CalendarView, CalendarFilters } from '@/types/calendar.types';
import type { Task, TaskFilters, TaskBoardColumn } from '@/types/task.types';
import type { PaginatedResult } from '@/types/common.types';
import { eventsMock, tasksMock, USERS, COMPANIES, CONTACTS, TASK_TAGS } from '@/features/calendar/mocks/calendar.mock';
import { simulateRequest } from '@/lib/simulate-request';
import { generateId } from '@/utils/generateId';

/* ── Events ── */

let eventsCache: CalendarEvent[] = [...eventsMock];

export const calendarService = {
  async getEvents(): Promise<CalendarEvent[]> {
    return simulateRequest([...eventsCache]);
  },

  async getEventById(id: string): Promise<CalendarEvent | null> {
    const event = eventsCache.find((e) => e.id === id) ?? null;
    return simulateRequest(event);
  },

  async createEvent(input: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
    const now = new Date().toISOString();
    const event: CalendarEvent = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    eventsCache.push(event);
    return simulateRequest(event);
  },

  async updateEvent(id: string, changes: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CalendarEvent> {
    const index = eventsCache.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event "${id}" not found`);
    const updated = { ...eventsCache[index]!, ...changes, updatedAt: new Date().toISOString() };
    eventsCache[index] = updated;
    return simulateRequest(updated);
  },

  async deleteEvent(id: string): Promise<void> {
    const index = eventsCache.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event "${id}" not found`);
    eventsCache.splice(index, 1);
    return simulateRequest(undefined);
  },

  async filterEvents(filters: Partial<CalendarFilters>): Promise<CalendarEvent[]> {
    let filtered = [...eventsCache];
    if (filters.ownerId) filtered = filtered.filter((e) => e.ownerId === filters.ownerId);
    if (filters.companyId) filtered = filtered.filter((e) => e.companyId === filters.companyId);
    if (filters.type) filtered = filtered.filter((e) => e.type === filters.type);
    if (filters.priority) filtered = filtered.filter((e) => e.priority === filters.priority);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.ownerName.toLowerCase().includes(q) ||
          e.companyName?.toLowerCase().includes(q) ||
          e.contactName?.toLowerCase().includes(q),
      );
    }
    return simulateRequest(filtered);
  },

  async getKPIs(): Promise<CalendarKPI[]> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const eventsToday = eventsCache.filter((e) => {
      const eDate = new Date(e.startTime);
      return eDate >= todayStart && eDate < new Date(todayStart.getTime() + 86400000);
    });

    const meetingsThisWeek = eventsCache.filter((e) => {
      const eDate = new Date(e.startTime);
      return e.type === 'meeting' && eDate >= todayStart && eDate < weekEnd;
    });

    const tasksDone = tasksMock.filter((t) => t.status === 'done');
    const tasksOverdue = tasksMock.filter((t) => {
      if (!t.dueDate || t.status === 'done' || t.status === 'cancelled') return false;
      return new Date(t.dueDate) < now;
    });

    const plannedTime = eventsCache
      .filter((e) => {
        const eDate = new Date(e.startTime);
        return eDate >= todayStart && eDate < weekEnd && e.endTime;
      })
      .reduce((total, e) => {
        const start = new Date(e.startTime).getTime();
        const end = new Date(e.endTime!).getTime();
        return total + (end - start) / (1000 * 60);
      }, 0);

    return [
      { id: 'kpi-1', label: 'Événements aujourd\'hui', value: String(eventsToday.length), icon: 'calendar', description: 'Sur la journée en cours', change: eventsToday.length - 3 },
      { id: 'kpi-2', label: 'Réunions cette semaine', value: String(meetingsThisWeek.length), icon: 'users', description: 'Réunions planifiées', change: 12.5 },
      { id: 'kpi-3', label: 'Tâches terminées', value: String(tasksDone.length), icon: 'checkCircle2', description: 'Depuis le début du mois', change: 8.3 },
      { id: 'kpi-4', label: 'Tâches en retard', value: String(tasksOverdue.length), icon: 'alertTriangle', description: 'À traiter en priorité', change: tasksOverdue.length > 5 ? -15.2 : 0 },
      { id: 'kpi-5', label: 'Temps planifié', value: `${Math.round(plannedTime)}min`, icon: 'clock', description: 'Cette semaine' },
    ];
  },
};

/* ── Tasks ── */

let tasksCache: Task[] = [...tasksMock];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return simulateRequest([...tasksCache]);
  },

  async getTaskById(id: string): Promise<Task | null> {
    const task = tasksCache.find((t) => t.id === id) ?? null;
    return simulateRequest(task);
  },

  async createTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    tasksCache.push(task);
    return simulateRequest(task);
  },

  async updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> {
    const index = tasksCache.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task "${id}" not found`);
    const updated = { ...tasksCache[index]!, ...changes, updatedAt: new Date().toISOString() };
    tasksCache[index] = updated;
    return simulateRequest(updated);
  },

  async deleteTask(id: string): Promise<void> {
    const index = tasksCache.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task "${id}" not found`);
    tasksCache.splice(index, 1);
    return simulateRequest(undefined);
  },

  async filterTasks(filters: Partial<TaskFilters>): Promise<Task[]> {
    let filtered = [...tasksCache];
    if (filters.assigneeId) filtered = filtered.filter((t) => t.assigneeId === filters.assigneeId);
    if (filters.priority) filtered = filtered.filter((t) => t.priority === filters.priority);
    if (filters.status) filtered = filtered.filter((t) => t.status === filters.status);
    if (filters.relatedEntity) filtered = filtered.filter((t) => t.relatedEntity === filters.relatedEntity);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assigneeName?.toLowerCase().includes(q) ||
          t.relatedEntityName?.toLowerCase().includes(q),
      );
    }
    return simulateRequest(filtered);
  },

  async getTasksByBoardColumn(): Promise<Record<TaskBoardColumn, Task[]>> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const overdue: Task[] = [];
    const today: Task[] = [];
    const thisWeek: Task[] = [];
    const done: Task[] = [];

    for (const task of tasksCache) {
      if (task.status === 'done' || task.status === 'cancelled') {
        if (task.status === 'done') done.push(task);
        continue;
      }
      if (!task.dueDate) {
        thisWeek.push(task);
        continue;
      }
      const dueDate = new Date(task.dueDate);
      if (dueDate < todayStart) {
        overdue.push(task);
      } else if (dueDate >= todayStart && dueDate < new Date(todayStart.getTime() + 86400000)) {
        today.push(task);
      } else if (dueDate >= todayStart && dueDate < weekEnd) {
        thisWeek.push(task);
      } else {
        thisWeek.push(task);
      }
    }

    return { overdue, today, this_week: thisWeek, done };
  },

  async addComment(taskId: string, content: string, authorId: string, authorName: string): Promise<Task> {
    const task = tasksCache.find((t) => t.id === taskId);
    if (!task) throw new Error(`Task "${taskId}" not found`);
    const comment = {
      id: generateId(),
      authorId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
    };
    task.comments.push(comment);
    task.updatedAt = new Date().toISOString();
    return simulateRequest({ ...task });
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const task = tasksCache.find((t) => t.id === taskId);
    if (!task) throw new Error(`Task "${taskId}" not found`);
    const subtask = task.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      task.updatedAt = new Date().toISOString();
    }
    return simulateRequest({ ...task });
  },
};

/* ── Shared data accessors ── */

export const calendarDataService = {
  getUsers() { return USERS; },
  getCompanies() { return COMPANIES; },
  getContacts() { return CONTACTS; },
  getTags() { return TASK_TAGS; },
};

