import type { CalendarEvent } from '@/types/calendar.types';
import { todayAt, inDaysAt } from '@/mocks/mock-date-helpers';

export const calendarEventsMock: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Point hebdo équipe commerciale',
    startTime: todayAt(9, 0),
    endTime: todayAt(9, 30),
    location: 'Salle Atlas',
  },
  {
    id: 'event-2',
    title: 'Démo produit — Nour Cosmétiques',
    startTime: todayAt(11, 0),
    endTime: todayAt(11, 45),
    attendeeName: 'Yassine Bennani',
    location: 'Visioconférence',
  },
  {
    id: 'event-3',
    title: 'Négociation contrat — Groupe Kawtar',
    startTime: todayAt(15, 0),
    endTime: todayAt(15, 30),
    attendeeName: 'Omar Chraibi',
  },
  {
    id: 'event-4',
    title: 'Découverte besoin — Atlas Logistique',
    startTime: inDaysAt(1, 10, 0),
    endTime: inDaysAt(1, 10, 30),
    attendeeName: 'Sara Idrissi',
    location: 'Visioconférence',
  },
  {
    id: 'event-5',
    title: 'Revue trimestrielle pipeline',
    startTime: inDaysAt(2, 14, 0),
    endTime: inDaysAt(2, 15, 0),
    location: 'Salle Atlas',
  },
] as CalendarEvent[];
