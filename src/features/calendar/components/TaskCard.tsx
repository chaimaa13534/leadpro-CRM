import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Task, TaskPriority } from '@/types/task.types';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/Card';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  compact?: boolean;
  className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; variant: 'danger' | 'warning' | 'primary' | 'neutral' }> = {
  critical: { label: 'Critique', variant: 'danger' },
  high: { label: 'Haute', variant: 'warning' },
  medium: { label: 'Moyenne', variant: 'primary' },
  low: { label: 'Basse', variant: 'neutral' },
};

const statusLabels: Record<string, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
  cancelled: 'Annulée',
};

function TaskCardComponent({ task, onClick, compact = false, className }: TaskCardProps) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.status === 'done' || task.status === 'cancelled') return false;
    return new Date(task.dueDate) < new Date();
  }, [task.dueDate, task.status]);

  const dueDateFormatted = useMemo(() => {
    if (!task.dueDate) return null;
    try {
      const d = new Date(task.dueDate);
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      if (isToday) return `Aujourd'hui ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return null;
    }
  }, [task.dueDate]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
      className={cn('cursor-pointer', className)}
      onClick={() => onClick?.(task)}
    >
      <Card variant="outlined" padding="sm" interactive>
        <CardContent className="flex items-start gap-3 p-2.5">
          {/* Priority indicator */}
          <div
            className={cn(
              'mt-1 h-2 w-2 shrink-0 rounded-full',
              priority.variant === 'danger' && 'bg-danger-500',
              priority.variant === 'warning' && 'bg-warning-500',
              priority.variant === 'primary' && 'bg-accent',
              priority.variant === 'neutral' && 'bg-neutral-400',
            )}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            {/* Title */}
            <p className={cn('font-medium text-text-primary leading-snug', compact ? 'text-[12px]' : 'text-[13px]')}>
              {task.title}
            </p>

            {/* Meta */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge size="sm" variant={priority.variant}>
                {priority.label}
              </Badge>

              <Badge
                size="sm"
                variant={
                  task.status === 'done' ? 'success' :
                  task.status === 'in_progress' ? 'info' :
                  task.status === 'cancelled' ? 'neutral' : 'default'
                }
              >
                {statusLabels[task.status] ?? task.status}
              </Badge>

              {dueDateFormatted && (
                <span className={cn('text-[11px]', isOverdue ? 'text-danger-500 font-medium' : 'text-text-tertiary')}>
                  <Icons.clock className="inline size-3 mr-0.5" aria-hidden="true" />
                  {dueDateFormatted}
                </span>
              )}
            </div>

            {/* Tags */}
            {task.tags.length > 0 && !compact && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Subtask progress */}
            {task.subtasks.length > 0 && !compact && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-background-tertiary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                </span>
              </div>
            )}

            {/* Assignee */}
            {!compact && task.assigneeName && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-subtle text-[9px] font-semibold text-accent">
                  {task.assigneeName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[11px] text-text-tertiary">{task.assigneeName}</span>
              </div>
            )}
          </div>

          {/* Comments count */}
          {task.comments.length > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-text-tertiary">
              <Icons.messageSquare className="size-3" aria-hidden="true" />
              <span className="text-[11px] tabular-nums">{task.comments.length}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const TaskCard = memo(TaskCardComponent);

