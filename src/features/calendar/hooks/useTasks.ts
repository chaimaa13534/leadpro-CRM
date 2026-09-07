import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFilters, TaskBoardColumn } from '@/types/task.types';
import { taskService } from '@/features/calendar/services/calendar.service';

interface UseTasksReturn {
  tasks: Task[];
  boardColumns: Record<TaskBoardColumn, Task[]>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  applyFilters: (filters: Partial<TaskFilters>) => Promise<void>;
  createTask: (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | null>;
  updateTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | undefined;
  addComment: (taskId: string, content: string, authorId: string, authorName: string) => Promise<Task | null>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<Task | null>;
}

/**
 * Hook pour la gestion des tâches.
 * Charge les tâches, permet le filtrage, CRUD, commentaires et sous-tâches.
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boardColumns, setBoardColumns] = useState<Record<TaskBoardColumn, Task[]>>({
    overdue: [],
    today: [],
    this_week: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedTasks, columns] = await Promise.all([
        taskService.getTasks(),
        taskService.getTasksByBoardColumn(),
      ]);
      setTasks(fetchedTasks);
      setBoardColumns(columns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const applyFilters = useCallback(async (filters: Partial<TaskFilters>) => {
    setLoading(true);
    try {
      const filtered = await taskService.filterTasks(filters);
      setTasks(filtered);
      if (!filters.status && !filters.assigneeId && !filters.priority && !filters.searchQuery) {
        const columns = await taskService.getTasksByBoardColumn();
        setBoardColumns(columns);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du filtrage');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await taskService.createTask(input);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updated = await taskService.updateTask(id, changes);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  }, []);

  const getTaskById = useCallback((id: string) => {
    return tasks.find((t) => t.id === id);
  }, [tasks]);

  const addComment = useCallback(async (taskId: string, content: string, authorId: string, authorName: string) => {
    try {
      const updated = await taskService.addComment(taskId, content, authorId, authorName);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du commentaire');
      return null;
    }
  }, []);

  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    try {
      const updated = await taskService.toggleSubtask(taskId, subtaskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de sous-tâche');
      return null;
    }
  }, []);

  return {
    tasks,
    boardColumns,
    loading,
    error,
    refresh,
    applyFilters,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    addComment,
    toggleSubtask,
  };
}

