import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { calendarEventsMock } from '@/mocks/calendar.mock';
import { formatDate } from '@/utils/formatDate';
import { isToday } from '@/utils/isToday';

function formatTimeRange(startTime: string, endTime?: string): string {
  const start = formatDate(startTime, 'datetime').split(' ').pop() ?? '';
  if (!endTime) return start;
  const end = formatDate(endTime, 'datetime').split(' ').pop() ?? '';
  return `${start} – ${end}`;
}

/**
 * Widget compact du calendrier : uniquement les RDV du jour et les
 * prochaines réunions, pas de vue calendrier complète (mois/semaine).
 */
export function CalendarWidget() {
  const todayEvents = calendarEventsMock.filter((event) =>
    isToday(event.startTime),
  );
  const upcomingEvents = calendarEventsMock.filter(
    (event) => !isToday(event.startTime),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier</CardTitle>
        <CardDescription>Rendez-vous du jour et à venir</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-4 px-6 pb-6">
        <div>
          <p className="mb-2 text-label text-text-secondary">Aujourd'hui</p>
          {todayEvents.length === 0 ? (
            <p className="text-caption text-text-secondary">
              Aucun rendez-vous aujourd'hui.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {todayEvents.map((event, index) => (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary-600" />
                  <div className="min-w-0">
                    <p className="truncate text-body text-text-primary">
                      {event.title}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {formatTimeRange(event.startTime, event.endTime)}
                      {event.location ? ` · ${event.location}` : ''}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-label text-text-secondary">À venir</p>
          <ul className="flex flex-col gap-2">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="flex items-start gap-2.5">
                <Icons.calendar
                  className="mt-0.5 size-3.5 shrink-0 text-text-secondary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-body text-text-primary">
                    {event.title}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {formatDate(event.startTime, 'medium')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
