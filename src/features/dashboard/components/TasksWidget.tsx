import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { tasksMock } from '@/mocks/tasks.mock';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/lib/constants/statuses.constants';
import { formatDate } from '@/utils/formatDate';

const STATUS_TO_BADGE_VARIANT = {
  todo: 'neutral',
  in_progress: 'info',
  done: 'success',
  cancelled: 'danger',
} as const;

/**
 * Widget des tâches du jour. Les cases à cocher sont statiques (pas de
 * mutation d'état ni d'appel service aujourd'hui) — la checkbox reflète
 * uniquement `status === 'done'` au chargement.
 */
export function TasksWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tâches du jour</CardTitle>
        <CardDescription>{tasksMock.length} tâches planifiées</CardDescription>
      </CardHeader>
      <ul className="flex flex-col gap-1 px-2 pb-4">
        {tasksMock.map((task, index) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 hover:bg-muted"
          >
            <Checkbox
              defaultChecked={task.status === 'done'}
              disabled
              aria-label={`Tâche : ${task.title}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body text-text-primary">
                {task.title}
              </p>
              <div className="flex items-center gap-2 text-caption text-text-secondary">
                {task.dueDate ? (
                  <span>{formatDate(task.dueDate, 'datetime')}</span>
                ) : null}
                <span
                  className="size-1 rounded-full bg-current"
                  aria-hidden="true"
                />
                <span>{TASK_PRIORITIES[task.priority].label}</span>
              </div>
            </div>
            <Badge variant={STATUS_TO_BADGE_VARIANT[task.status]}>
              {TASK_STATUSES[task.status].label}
            </Badge>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
