import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import { eventSchema, type EventFormValues } from '@/features/calendar/schemas/event.schema';
import { calendarDataService } from '@/features/calendar/services/calendar.service';
import type { CalendarEvent, EventType, EventPriority } from '@/types/calendar.types';

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'meeting', label: 'Réunion' },
  { value: 'call', label: 'Appel' },
  { value: 'demo', label: 'Démo' },
  { value: 'appointment', label: 'RDV' },
  { value: 'reminder', label: 'Rappel' },
  { value: 'deadline', label: 'Échéance' },
  { value: 'lunch', label: 'Déjeuner' },
  { value: 'other', label: 'Autre' },
];

const priorities: { value: EventPriority; label: string }[] = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'critical', label: 'Critique' },
];

const durations = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1h' },
  { value: '90', label: '1h30' },
  { value: '120', label: '2h' },
  { value: '180', label: '3h' },
  { value: '240', label: '4h' },
];

function EventFormModalComponent({ open, onClose, onSubmit }: EventFormModalProps) {
  const users = calendarDataService.getUsers();
  const companies = calendarDataService.getCompanies();
  const contacts = calendarDataService.getContacts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      duration: 60,
      allDay: false,
      type: 'meeting',
      priority: 'medium',
      isOnline: false,
      participants: [],
    },
  });

  const handleFormSubmit = useCallback(
    async (data: EventFormValues) => {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

      const eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        description: data.description || '',
        startTime: startDateTime.toISOString(),
        endTime: data.allDay ? undefined : endDateTime.toISOString(),
        allDay: data.allDay,
        type: data.type as EventType,
        priority: data.priority as EventPriority,
        color: data.color,
        location: data.location,
        isOnline: data.isOnline,
        meetingUrl: data.meetingUrl,
        companyId: data.companyId,
        companyName: data.companyName,
        contactId: data.contactId,
        contactName: data.contactName,
        ownerId: 'user-1',
        ownerName: 'Alex Martin',
        participants: data.participants || [],
        documents: [],
        history: [],
        notes: data.notes,
        reminder: data.reminder,
      };

      await onSubmit(eventData);
      reset();
      onClose();
    },
    [onSubmit, onClose, reset],
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Nouvel événement"
          >
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-text-primary">Nouvel événement</h2>
                <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover" aria-label="Fermer">
                  <Icons.close className="size-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4 space-y-4">
              <Input
                label="Titre"
                placeholder="Titre de l'événement"
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Date"
                  type="date"
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />
                <Input
                  label="Heure"
                  type="time"
                  error={errors.startTime?.message}
                  {...register('startTime')}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Durée"
                  options={durations}
                  {...register('duration', { valueAsNumber: true })}
                />
                <Select
                  label="Type"
                  options={eventTypes}
                  {...register('type')}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Priorité"
                  options={priorities}
                  {...register('priority')}
                />
                <Input
                  label="Lieu"
                  placeholder="Salle ou lien"
                  {...register('location')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  {...register('allDay')}
                />
                <label htmlFor="allDay" className="text-[13px] text-text-primary">Toute la journée</label>

                <input
                  type="checkbox"
                  id="isOnline"
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent ml-4"
                  {...register('isOnline')}
                />
                <label htmlFor="isOnline" className="text-[13px] text-text-primary">En ligne</label>
              </div>

              <Input
                label="Description"
                placeholder="Description (optionnelle)"
                {...register('description')}
              />

              <Input
                label="Notes"
                placeholder="Notes internes"
                {...register('notes')}
              />

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                  Annuler
                </Button>
                <Button size="sm" type="submit" loading={isSubmitting}>
                  <Icons.add className="size-4" />
                  Créer l'événement
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const EventFormModal = memo(EventFormModalComponent);
