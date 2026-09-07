import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import { taskSchema, type TaskFormValues } from '@/features/calendar/schemas/task.schema';
import { calendarDataService } from '@/features/calendar/services/calendar.service';
import type { Task, TaskPriority, TaskStatus, TaskRelatedEntity } from '@/types/task.types';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'critical', label: 'Critique' },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

const relatedEntities: { value: TaskRelatedEntity | '', label: string }[] = [
  { value: '', label: 'Aucun' },
  { value: 'lead', label: 'Lead' },
  { value: 'contact', label: 'Contact' },
  { value: 'company', label: 'Entreprise' },
  { value: 'opportunity', label: 'Opportunité' },
];

function TaskFormModalComponent({ open, onClose, onSubmit }: TaskFormModalProps) {
  const users = calendarDataService.getUsers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      assigneeId: users[0]?.id ?? '',
      priority: 'medium',
      dueDate: '',
      status: 'todo',
      relatedEntity: '',
      relatedEntityId: '',
      relatedEntityName: '',
      companyId: '',
      companyName: '',
      contactId: '',
      contactName: '',
      opportunityId: '',
      opportunityName: '',
      tags: [],
      notes: '',
    },
  });

  const handleFormSubmit = useCallback(
    async (data: TaskFormValues) => {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        assigneeName: users.find((user) => user.id === data.assigneeId)?.name ?? 'Inconnu',
        priority: data.priority,
        dueDate: data.dueDate || undefined,
        status: data.status,
        companyId: data.companyId || undefined,
        companyName: data.companyName || undefined,
        contactId: data.contactId || undefined,
        contactName: data.contactName || undefined,
        opportunityId: data.opportunityId || undefined,
        opportunityName: data.opportunityName || undefined,
        relatedEntity: data.relatedEntity || undefined,
        relatedEntityId: data.relatedEntityId || undefined,
        relatedEntityName: data.relatedEntityName || undefined,
        tags: data.tags,
        notes: data.notes,
        comments: [],
        documents: [],
        subtasks: [],
        activities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

      await onSubmit(taskData);
      reset();
      onClose();
    },
    [onClose, onSubmit, reset, users],
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-overlay"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Nouvelle tâche"
          >
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-text-primary">Nouvelle tâche</h2>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover"
                  aria-label="Fermer"
                >
                  <Icons.close className="size-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4 space-y-4">
              <Input
                label="Titre"
                placeholder="Titre de la tâche"
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Responsable"
                  options={[
                    { value: '', label: 'Choisir un responsable' },
                    ...users.map((user) => ({ value: user.id, label: user.name })),
                  ]}
                  {...register('assigneeId')}
                />
                <Select label="Priorité" options={priorities} {...register('priority')} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Date d'échéance" type="date" {...register('dueDate')} />
                <Select label="Statut" options={statuses} {...register('status')} />
              </div>

              <Input
                label="Description"
                placeholder="Description de la tâche"
                {...register('description')}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Entité liée" options={relatedEntities} {...register('relatedEntity')} />
                <Input label="Nom de l'entité" placeholder="Ex: Nom du client" {...register('relatedEntityName')} />
              </div>

              <Input label="Notes" placeholder="Notes internes" {...register('notes')} />

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                  Annuler
                </Button>
                <Button size="sm" type="submit" loading={isSubmitting}>
                  <Icons.check className="size-4" />
                  Créer la tâche
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const TaskFormModal = memo(TaskFormModalComponent);
