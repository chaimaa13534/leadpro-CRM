import { useCallback, useState } from 'react';
import type { CalendarEvent } from '@/types/calendar.types';
import type { Task } from '@/types/task.types';
import { calendarService, taskService } from '@/features/calendar/services/calendar.service';
import { useNotifications } from '@/hooks/useNotifications';

interface DragResult {
  type: 'event' | 'task';
  id: string;
  newDate?: Date;
  newHour?: number;
  newStatus?: string;
  newAssigneeId?: string;
}

interface UseCalendarDragAndDropReturn {
  isDragging: boolean;
  draggedItem: { type: 'event' | 'task'; id: string } | null;
  handleDragStart: (type: 'event' | 'task', id: string) => void;
  handleDragEnd: (result: DragResult) => Promise<void>;
  handleEventDrop: (eventId: string, newDate: Date, newHour: number) => Promise<void>;
  handleTaskStatusChange: (taskId: string, newStatus: string) => Promise<void>;
}

/**
 * Hook pour le Drag & Drop des événements et tâches.
 * Utilise dnd-kit au niveau des composants de vue, ce hook gère la logique métier.
 */
export function useCalendarDragAndDrop(
  onEventUpdate?: (id: string, changes: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<CalendarEvent | null>,
  onTaskUpdate?: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Task | null>,
): UseCalendarDragAndDropReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: 'event' | 'task'; id: string } | null>(null);
  const { success, error: notifyError } = useNotifications();

  const handleDragStart = useCallback((type: 'event' | 'task', id: string) => {
    setIsDragging(true);
    setDraggedItem({ type, id });
  }, []);

  const handleDragEnd = useCallback(async (result: DragResult) => {
    setIsDragging(false);
    setDraggedItem(null);

    try {
      if (result.type === 'event') {
        const changes: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>> = {};
        if (result.newDate) {
          const newDate = new Date(result.newDate);
          if (result.newHour !== undefined) newDate.setHours(result.newHour);
          changes.startTime = newDate.toISOString();
        }
        if (onEventUpdate) {
          await onEventUpdate(result.id, changes);
        } else {
          await calendarService.updateEvent(result.id, changes as any);
        }
        success('Événement déplacé avec succès');
      } else if (result.type === 'task') {
        const changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = {};
        if (result.newStatus) changes.status = result.newStatus as Task['status'];
        if (result.newDate) changes.dueDate = result.newDate.toISOString();
        if (result.newAssigneeId) changes.assigneeId = result.newAssigneeId;
        if (onTaskUpdate) {
          await onTaskUpdate(result.id, changes);
        } else {
          await taskService.updateTask(result.id, changes as any);
        }
        success('Tâche déplacée avec succès');
      }
    } catch {
      notifyError('Erreur lors du déplacement');
    }
  }, [onEventUpdate, onTaskUpdate, success, notifyError]);

  const handleEventDrop = useCallback(async (eventId: string, newDate: Date, newHour: number) => {
    return handleDragEnd({ type: 'event', id: eventId, newDate, newHour });
  }, [handleDragEnd]);

  const handleTaskStatusChange = useCallback(async (taskId: string, newStatus: string) => {
    return handleDragEnd({ type: 'task', id: taskId, newStatus });
  }, [handleDragEnd]);

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleEventDrop,
    handleTaskStatusChange,
  };
}

