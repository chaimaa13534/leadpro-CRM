import type { ID } from '@/types/common.types';
import type { CalendarEvent, EventType, EventPriority, Participant, EventDocument, EventHistoryEntry } from '@/types/calendar.types';
import type { Task, TaskStatus, TaskPriority, TaskTag, TaskComment, TaskDocument, Subtask, TaskActivity } from '@/types/task.types';
import { todayAt, inDaysAt, daysAgo, hoursAgo } from '@/mocks/mock-date-helpers';

const NOW_ISO = new Date().toISOString();

/* ── Helpers ── */
const generateId = (): ID => `mock-${Math.random().toString(36).substring(2, 11)}`;

/* ── Shared data ── */
export const USERS = [
  { id: 'user-1', name: 'Alex Martin', email: 'alex.martin@leadpro.io' },
  { id: 'user-2', name: 'Sara Idrissi', email: 'sara.idrissi@leadpro.io' },
  { id: 'user-3', name: 'Yassine Bennani', email: 'yassine.bennani@leadpro.io' },
  { id: 'user-4', name: 'Omar Chraibi', email: 'omar.chraibi@leadpro.io' },
];

export const COMPANIES = [
  { id: 'company-1', name: 'Atlas Logistique' },
  { id: 'company-2', name: 'Nour Cosmétiques' },
  { id: 'company-3', name: 'Groupe Kawtar' },
  { id: 'company-4', name: 'Sanad Pharma' },
  { id: 'company-5', name: 'Atlas Textile' },
  { id: 'company-6', name: 'MediTech Solutions' },
  { id: 'company-7', name: 'GreenEnergy Maroc' },
  { id: 'company-8', name: 'Digital Services Pro' },
  { id: 'company-9', name: 'AgroPlus International' },
];

export const CONTACTS = [
  { id: 'contact-1', name: 'Fatima Zahra Alaoui', companyId: 'company-1' },
  { id: 'contact-2', name: 'Mehdi Benjelloun', companyId: 'company-2' },
  { id: 'contact-3', name: 'Amina Tazi', companyId: 'company-3' },
  { id: 'contact-4', name: 'Hicham El Fassi', companyId: 'company-4' },
  { id: 'contact-5', name: 'Nadia Belmahi', companyId: 'company-5' },
];

/* ── Event type colors ── */
export const EVENT_COLORS: Record<EventType, string> = {
  meeting: '#5452e5',
  call: '#10b981',
  demo: '#f59e0b',
  appointment: '#3b82f6',
  reminder: '#8b5cf6',
  deadline: '#ef4444',
  lunch: '#f97316',
  other: '#636c87',
};

/* ── Build participants ── */
function buildParticipants(userIds: string[]): Participant[] {
  return userIds.map((uid) => {
    const user = USERS.find((u) => u.id === uid)!;
    const statuses: Participant['responseStatus'][] = ['pending', 'accepted', 'accepted', 'accepted', 'declined', 'tentative'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const responseStatus = statuses[randomIndex] ?? 'pending';
    return {
      id: generateId(),
      name: user.name,
      email: user.email,
      responseStatus,
    };
  });
}

/* ══════════════════════════════════════════════════════════════
   EVENTS — 55 events
   ══════════════════════════════════════════════════════════════ */
export const eventsMock: CalendarEvent[] = [
  // ── Today events (8 events) ──
  {
    id: 'event-001', title: 'Point hebdo équipe commerciale', type: 'meeting', priority: 'high',
    startTime: todayAt(9, 0), endTime: todayAt(9, 30),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(1),
  },
  {
    id: 'event-002', title: 'Démo produit — Nour Cosmétiques', type: 'demo', priority: 'high',
    startTime: todayAt(11, 0), endTime: todayAt(11, 45),
    color: EVENT_COLORS.demo, isOnline: true, meetingUrl: 'https://meet.leadpro.io/demo-nour',
    companyId: 'company-2', companyName: 'Nour Cosmétiques', contactId: 'contact-2', contactName: 'Mehdi Benjelloun',
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
  {
    id: 'event-003', title: 'Négociation contrat — Groupe Kawtar', type: 'meeting', priority: 'critical',
    startTime: todayAt(15, 0), endTime: todayAt(15, 30),
    color: EVENT_COLORS.meeting, location: 'Bureau Commercial',
    companyId: 'company-3', companyName: 'Groupe Kawtar', contactId: 'contact-3', contactName: 'Amina Tazi',
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(3), updatedAt: hoursAgo(2),
  },
  {
    id: 'event-004', title: 'Appel de suivi — Sanad Pharma', type: 'call', priority: 'medium',
    startTime: todayAt(10, 0), endTime: todayAt(10, 15),
    color: EVENT_COLORS.call, isOnline: true,
    companyId: 'company-4', companyName: 'Sanad Pharma', contactId: 'contact-4', contactName: 'Hicham El Fassi',
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
  {
    id: 'event-005', title: 'Déjeuner client — Atlas Logistique', type: 'lunch', priority: 'low',
    startTime: todayAt(12, 30), endTime: todayAt(14, 0),
    color: EVENT_COLORS.lunch, location: 'Le Café Royal',
    companyId: 'company-1', companyName: 'Atlas Logistique', contactId: 'contact-1', contactName: 'Fatima Zahra Alaoui',
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(4), updatedAt: daysAgo(1),
  },
  {
    id: 'event-006', title: 'Mise à jour pipeline mensuel', type: 'meeting', priority: 'high',
    startTime: todayAt(16, 0), endTime: todayAt(16, 45),
    color: EVENT_COLORS.meeting, isOnline: true, meetingUrl: 'https://meet.leadpro.io/pipeline-review',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(30), updatedAt: daysAgo(1),
  },
  {
    id: 'event-007', title: 'Découverte besoin — GreenEnergy Maroc', type: 'appointment', priority: 'high',
    startTime: todayAt(14, 0), endTime: todayAt(14, 45),
    color: EVENT_COLORS.appointment, isOnline: true,
    companyId: 'company-7', companyName: 'GreenEnergy Maroc',
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(6), updatedAt: daysAgo(2),
  },
  {
    id: 'event-008', title: 'Rappel: Signature contrat urgent', type: 'reminder', priority: 'critical',
    startTime: todayAt(8, 30), endTime: todayAt(8, 45),
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-1']),
    documents: [], history: [], notes: 'Signature du contrat Groupe Kawtar avant 12h',
    ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },

  // ── Tomorrow events (6 events) ──
  {
    id: 'event-009', title: 'Découverte besoin — Atlas Logistique', type: 'appointment', priority: 'high',
    startTime: inDaysAt(1, 10, 0), endTime: inDaysAt(1, 10, 30),
    color: EVENT_COLORS.appointment, isOnline: true,
    companyId: 'company-1', companyName: 'Atlas Logistique', contactId: 'contact-1', contactName: 'Fatima Zahra Alaoui',
    participants: buildParticipants(['user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: 'event-010', title: 'Formation CRM — Nouveaux recrus', type: 'meeting', priority: 'medium',
    startTime: inDaysAt(1, 9, 0), endTime: inDaysAt(1, 11, 0),
    color: EVENT_COLORS.meeting, location: 'Salle de formation',
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(14), updatedAt: daysAgo(3),
  },
  {
    id: 'event-011', title: 'Appel prospection — AgroPlus', type: 'call', priority: 'medium',
    startTime: inDaysAt(1, 11, 0), endTime: inDaysAt(1, 11, 20),
    color: EVENT_COLORS.call,
    companyId: 'company-9', companyName: 'AgroPlus International',
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
  {
    id: 'event-012', title: 'Deadline proposition — Digital Services', type: 'deadline', priority: 'critical',
    startTime: inDaysAt(1, 17, 0), endTime: inDaysAt(1, 17, 30),
    color: EVENT_COLORS.deadline,
    companyId: 'company-8', companyName: 'Digital Services Pro',
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(10), updatedAt: daysAgo(2),
  },
  {
    id: 'event-013', title: 'Réunion stratégie Q3', type: 'meeting', priority: 'high',
    startTime: inDaysAt(1, 14, 0), endTime: inDaysAt(1, 16, 0),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(21), updatedAt: daysAgo(3),
  },
  {
    id: 'event-014', title: 'Rappel: Préparer rapport mensuel', type: 'reminder', priority: 'medium',
    startTime: inDaysAt(1, 8, 0), endTime: inDaysAt(1, 8, 30),
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },

  // ── Day after tomorrow (5 events) ──
  {
    id: 'event-015', title: 'Revue trimestrielle pipeline', type: 'meeting', priority: 'high',
    startTime: inDaysAt(2, 14, 0), endTime: inDaysAt(2, 15, 0),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(60), updatedAt: daysAgo(7),
  },
  {
    id: 'event-016', title: 'Démo produit — MediTech Solutions', type: 'demo', priority: 'high',
    startTime: inDaysAt(2, 10, 0), endTime: inDaysAt(2, 11, 0),
    color: EVENT_COLORS.demo, isOnline: true,
    companyId: 'company-6', companyName: 'MediTech Solutions',
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(2),
  },
  {
    id: 'event-017', title: 'Appel qualification — GreenEnergy Maroc', type: 'call', priority: 'medium',
    startTime: inDaysAt(2, 15, 30), endTime: inDaysAt(2, 15, 45),
    color: EVENT_COLORS.call,
    companyId: 'company-7', companyName: 'GreenEnergy Maroc',
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: 'event-018', title: 'Atelier CRM avancé', type: 'meeting', priority: 'low',
    startTime: inDaysAt(2, 9, 0), endTime: inDaysAt(2, 12, 0),
    color: EVENT_COLORS.meeting, location: 'Salle polyvalente',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(14), updatedAt: daysAgo(4),
  },
  {
    id: 'event-019', title: 'Deadline: Proposition commerciale Atlas', type: 'deadline', priority: 'critical',
    startTime: inDaysAt(2, 18, 0), endTime: inDaysAt(2, 18, 15),
    color: EVENT_COLORS.deadline,
    companyId: 'company-1', companyName: 'Atlas Logistique',
    participants: buildParticipants(['user-4']),
    documents: [], history: [], notes: 'Remise de la proposition avant 18h',
    ownerId: 'user-4', ownerName: 'Omar Chraibi',
    createdAt: daysAgo(14), updatedAt: daysAgo(1),
  },

  // ── In 3 days (5 events) ──
  {
    id: 'event-020', title: 'Point commercial hebdo', type: 'meeting', priority: 'high',
    startTime: inDaysAt(3, 9, 0), endTime: inDaysAt(3, 9, 30),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(1),
  },
  {
    id: 'event-021', title: 'Démo produit — AgroPlus International', type: 'demo', priority: 'high',
    startTime: inDaysAt(3, 14, 0), endTime: inDaysAt(3, 14, 45),
    color: EVENT_COLORS.demo, isOnline: true,
    companyId: 'company-9', companyName: 'AgroPlus International',
    participants: buildParticipants(['user-1', 'user-2']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },
  {
    id: 'event-022', title: 'Appel — Suivi devis Sanad', type: 'call', priority: 'medium',
    startTime: inDaysAt(3, 11, 0), endTime: inDaysAt(3, 11, 15),
    color: EVENT_COLORS.call,
    companyId: 'company-4', companyName: 'Sanad Pharma',
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(4), updatedAt: daysAgo(2),
  },
  {
    id: 'event-023', title: 'RDV client — Nour Cosmétiques', type: 'appointment', priority: 'high',
    startTime: inDaysAt(3, 15, 0), endTime: inDaysAt(3, 16, 0),
    color: EVENT_COLORS.appointment, location: 'Bureau Nour',
    companyId: 'company-2', companyName: 'Nour Cosmétiques', contactId: 'contact-2', contactName: 'Mehdi Benjelloun',
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(10), updatedAt: daysAgo(3),
  },
  {
    id: 'event-024', title: 'Rappel: Appeler Omar pour suivi', type: 'reminder', priority: 'low',
    startTime: inDaysAt(3, 10, 0), endTime: inDaysAt(3, 10, 5),
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-4']),
    documents: [], history: [], ownerId: 'user-4', ownerName: 'Omar Chraibi',
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },

  // ── In 4 days (4 events) ──
  {
    id: 'event-025', title: 'Revue deals avec la direction', type: 'meeting', priority: 'high',
    startTime: inDaysAt(4, 10, 0), endTime: inDaysAt(4, 11, 30),
    color: EVENT_COLORS.meeting, location: 'Salle de direction',
    participants: buildParticipants(['user-1', 'user-2']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(14), updatedAt: daysAgo(2),
  },
  {
    id: 'event-026', title: 'Appel prospection — Textile Haim', type: 'call', priority: 'low',
    startTime: inDaysAt(4, 14, 0), endTime: inDaysAt(4, 14, 20),
    color: EVENT_COLORS.call,
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: 'event-027', title: 'Démo — Solution Analytics', type: 'demo', priority: 'medium',
    startTime: inDaysAt(4, 11, 0), endTime: inDaysAt(4, 11, 30),
    color: EVENT_COLORS.demo, isOnline: true,
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(8), updatedAt: daysAgo(2),
  },
  {
    id: 'event-028', title: 'Lunch équipe', type: 'lunch', priority: 'low',
    startTime: inDaysAt(4, 12, 0), endTime: inDaysAt(4, 13, 30),
    color: EVENT_COLORS.lunch, location: 'Les Palmiers',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(2), updatedAt: hoursAgo(2),
  },

  // ── In 5 days (4 events) ──
  {
    id: 'event-029', title: 'Point hebdo — Bilan juillet', type: 'meeting', priority: 'medium',
    startTime: inDaysAt(5, 9, 0), endTime: inDaysAt(5, 10, 0),
    color: EVENT_COLORS.meeting, isOnline: true,
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(1),
  },
  {
    id: 'event-030', title: 'Appel — Relance Atlas Logistique', type: 'call', priority: 'high',
    startTime: inDaysAt(5, 10, 30), endTime: inDaysAt(5, 10, 45),
    color: EVENT_COLORS.call,
    companyId: 'company-1', companyName: 'Atlas Logistique',
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
  {
    id: 'event-031', title: 'Démo produit — Nouveau client', type: 'demo', priority: 'high',
    startTime: inDaysAt(5, 14, 0), endTime: inDaysAt(5, 14, 45),
    color: EVENT_COLORS.demo, isOnline: true,
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(6), updatedAt: daysAgo(2),
  },
  {
    id: 'event-032', title: 'Deadline: Clôture deals juillet', type: 'deadline', priority: 'critical',
    startTime: inDaysAt(5, 18, 0), endTime: inDaysAt(5, 18, 30),
    color: EVENT_COLORS.deadline,
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(30), updatedAt: daysAgo(5),
  },

  // ── Next week (8 events) ──
  {
    id: 'event-033', title: 'Réunion planning août', type: 'meeting', priority: 'medium',
    startTime: inDaysAt(7, 10, 0), endTime: inDaysAt(7, 11, 0),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(14), updatedAt: daysAgo(3),
  },
  {
    id: 'event-034', title: 'Démo — Digital Services Pro', type: 'demo', priority: 'high',
    startTime: inDaysAt(7, 14, 0), endTime: inDaysAt(7, 15, 0),
    color: EVENT_COLORS.demo, isOnline: true,
    companyId: 'company-8', companyName: 'Digital Services Pro',
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(2),
  },
  {
    id: 'event-035', title: 'Appel — Suivi opportunité MediTech', type: 'call', priority: 'high',
    startTime: inDaysAt(7, 11, 0), endTime: inDaysAt(7, 11, 20),
    color: EVENT_COLORS.call,
    companyId: 'company-6', companyName: 'MediTech Solutions',
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },
  {
    id: 'event-036', title: 'RDV — Négociation annuelle', type: 'appointment', priority: 'high',
    startTime: inDaysAt(7, 15, 0), endTime: inDaysAt(7, 16, 30),
    color: EVENT_COLORS.appointment, location: 'Bureau client',
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(30), updatedAt: daysAgo(7),
  },
  {
    id: 'event-037', title: 'Déjeuner — Omar + client stratégique', type: 'lunch', priority: 'medium',
    startTime: inDaysAt(7, 12, 30), endTime: inDaysAt(7, 14, 0),
    color: EVENT_COLORS.lunch, location: 'La Table du Marché',
    participants: buildParticipants(['user-4']),
    documents: [], history: [], ownerId: 'user-4', ownerName: 'Omar Chraibi',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: 'event-038', title: 'Formation — Nouvelles fonctionnalités', type: 'meeting', priority: 'low',
    startTime: inDaysAt(8, 9, 0), endTime: inDaysAt(8, 11, 0),
    color: EVENT_COLORS.meeting, isOnline: true,
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(21), updatedAt: daysAgo(5),
  },
  {
    id: 'event-039', title: 'Rappel: Compléter reporting', type: 'reminder', priority: 'medium',
    startTime: inDaysAt(8, 17, 0), endTime: inDaysAt(8, 17, 15),
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: 'event-040', title: 'Deadline: Proposition GreenEnergy', type: 'deadline', priority: 'critical',
    startTime: inDaysAt(8, 12, 0), endTime: inDaysAt(8, 12, 15),
    color: EVENT_COLORS.deadline,
    companyId: 'company-7', companyName: 'GreenEnergy Maroc',
    participants: buildParticipants(['user-3']),
    documents: [], history: [], ownerId: 'user-3', ownerName: 'Yassine Bennani',
    createdAt: daysAgo(14), updatedAt: daysAgo(3),
  },

  // ── In 2 weeks (6 events) ──
  {
    id: 'event-041', title: 'Séminaire équipe commerciale', type: 'meeting', priority: 'high',
    startTime: inDaysAt(14, 9, 0), endTime: inDaysAt(14, 17, 0),
    color: EVENT_COLORS.meeting, location: 'Hôtel Palmeraie',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(60), updatedAt: daysAgo(7),
  },
  {
    id: 'event-042', title: 'Appel prospection — Secteur santé', type: 'call', priority: 'low',
    startTime: inDaysAt(14, 10, 0), endTime: inDaysAt(14, 10, 30),
    color: EVENT_COLORS.call,
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(10), updatedAt: daysAgo(5),
  },
  {
    id: 'event-043', title: 'Démo — Solution IA Analytics', type: 'demo', priority: 'high',
    startTime: inDaysAt(15, 11, 0), endTime: inDaysAt(15, 12, 0),
    color: EVENT_COLORS.demo, isOnline: true,
    participants: buildParticipants(['user-1', 'user-3']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(10), updatedAt: daysAgo(3),
  },
  {
    id: 'event-044', title: 'RDV annuel — Groupe Kawtar', type: 'appointment', priority: 'high',
    startTime: inDaysAt(15, 14, 0), endTime: inDaysAt(15, 16, 0),
    color: EVENT_COLORS.appointment, location: 'Siège Groupe Kawtar',
    companyId: 'company-3', companyName: 'Groupe Kawtar',
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(90), updatedAt: daysAgo(14),
  },
  {
    id: 'event-045', title: 'Deadline: Budget Q3', type: 'deadline', priority: 'high',
    startTime: inDaysAt(16, 17, 0), endTime: inDaysAt(16, 17, 30),
    color: EVENT_COLORS.deadline,
    participants: buildParticipants(['user-1', 'user-2']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(30), updatedAt: daysAgo(7),
  },
  {
    id: 'event-046', title: 'Rappel: Congés Alex', type: 'reminder', priority: 'low',
    startTime: inDaysAt(20, 9, 0), endTime: inDaysAt(22, 18, 0),
    allDay: true,
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(60), updatedAt: daysAgo(14),
  },

  // ── Past events (for history view — 9 events) ──
  {
    id: 'event-047', title: 'Point hebdo — Semaine dernière', type: 'meeting', priority: 'medium',
    startTime: daysAgo(7), endTime: daysAgo(7).replace(/(T.*)/, () => {
      const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(9, 30, 0, 0); return `T${d.toTimeString().substring(0, 8)}Z`;
    }),
    color: EVENT_COLORS.meeting, location: 'Salle Atlas',
    participants: buildParticipants(['user-1', 'user-2', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(14), updatedAt: daysAgo(7),
  },
  {
    id: 'event-048', title: 'Démo — Prospection banque', type: 'demo', priority: 'medium',
    startTime: daysAgo(5), endTime: daysAgo(5).replace(/(T.*)/, () => {
      const d = new Date(); d.setDate(d.getDate() - 5); d.setHours(14, 0, 0, 0); return `T${d.toTimeString().substring(0, 8)}Z`;
    }),
    color: EVENT_COLORS.demo, isOnline: true,
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(12), updatedAt: daysAgo(5),
  },
  {
    id: 'event-049', title: 'Appel — Négociation contrat', type: 'call', priority: 'high',
    startTime: daysAgo(3), endTime: daysAgo(3).replace(/(T.*)/, () => {
      const d = new Date(); d.setDate(d.getDate() - 3); d.setHours(11, 0, 0, 0); return `T${d.toTimeString().substring(0, 8)}Z`;
    }),
    color: EVENT_COLORS.call,
    participants: buildParticipants(['user-1', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(3),
  },
  {
    id: 'event-050', title: 'RDV — Suivi client Sanad', type: 'appointment', priority: 'medium',
    startTime: daysAgo(10), endTime: daysAgo(10).replace(/(T.*)/, () => {
      const d = new Date(); d.setDate(d.getDate() - 10); d.setHours(15, 0, 0, 0); return `T${d.toTimeString().substring(0, 8)}Z`;
    }),
    color: EVENT_COLORS.appointment, location: 'Bureau Sanad',
    companyId: 'company-4', companyName: 'Sanad Pharma',
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(20), updatedAt: daysAgo(10),
  },

  // ── Additional events to complete (5 more) ──
  {
    id: 'event-051', title: 'Formation produit — Équipe support', type: 'meeting', priority: 'medium',
    startTime: inDaysAt(10, 9, 0), endTime: inDaysAt(10, 12, 0),
    color: EVENT_COLORS.meeting, location: 'Salle de conférence',
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(21), updatedAt: daysAgo(7),
  },
  {
    id: 'event-052', title: 'Appel — Relance devis AgroPlus', type: 'call', priority: 'medium',
    startTime: inDaysAt(10, 14, 0), endTime: inDaysAt(10, 14, 15),
    color: EVENT_COLORS.call,
    companyId: 'company-9', companyName: 'AgroPlus International',
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(5), updatedAt: daysAgo(2),
  },
  {
    id: 'event-053', title: 'Démo — Solution CRM Mobile', type: 'demo', priority: 'high',
    startTime: inDaysAt(11, 10, 0), endTime: inDaysAt(11, 11, 0),
    color: EVENT_COLORS.demo, isOnline: true,
    participants: buildParticipants(['user-1', 'user-3', 'user-4']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(7), updatedAt: daysAgo(3),
  },
  {
    id: 'event-054', title: 'Deadline: Rapport activité mensuel', type: 'deadline', priority: 'high',
    startTime: inDaysAt(12, 17, 0), endTime: inDaysAt(12, 17, 30),
    color: EVENT_COLORS.deadline,
    participants: buildParticipants(['user-2']),
    documents: [], history: [], ownerId: 'user-2', ownerName: 'Sara Idrissi',
    createdAt: daysAgo(21), updatedAt: daysAgo(7),
  },
  {
    id: 'event-055', title: 'Rappel: Renouvellement abonnement', type: 'reminder', priority: 'low',
    startTime: inDaysAt(13, 9, 0), endTime: inDaysAt(13, 9, 10),
    color: EVENT_COLORS.reminder,
    participants: buildParticipants(['user-1']),
    documents: [], history: [], ownerId: 'user-1', ownerName: 'Alex Martin',
    createdAt: daysAgo(60), updatedAt: daysAgo(30),
  },
];

/* ══════════════════════════════════════════════════════════════
   TAGS
   ══════════════════════════════════════════════════════════════ */
export const TASK_TAGS: TaskTag[] = [
  { id: 'tag-1', name: 'Urgent', color: '#ef4444' },
  { id: 'tag-2', name: 'Prospection', color: '#3b82f6' },
  { id: 'tag-3', name: 'Client', color: '#10b981' },
  { id: 'tag-4', name: 'Interne', color: '#636c87' },
  { id: 'tag-5', name: 'Reporting', color: '#f59e0b' },
  { id: 'tag-6', name: 'Démo', color: '#8b5cf6' },
  { id: 'tag-7', name: 'Contrat', color: '#5452e5' },
  { id: 'tag-8', name: 'Facturation', color: '#f97316' },
];

/* ══════════════════════════════════════════════════════════════
   TASKS — 85 tasks
   ══════════════════════════════════════════════════════════════ */
const taskTemplates = [
  // Overdue tasks (15)
  { title: 'Relancer Atlas Textile après proposition', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -5, assigneeId: 'user-1', companyIdx: 4 },
  { title: 'Envoyer contrat signé à Groupe Kawtar', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -3, assigneeId: 'user-1', companyIdx: 2 },
  { title: 'Finaliser budget campagne Q3', priority: 'medium' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: -7, assigneeId: 'user-2' },
  { title: 'Mettre à jour base leads sectorielle', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -10, assigneeId: 'user-3' },
  { title: 'Préparer support présentation client', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -4, assigneeId: 'user-4' },
  { title: 'Appeler prospect GreenEnergy pour suivi', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -6, assigneeId: 'user-3', companyIdx: 6 },
  { title: 'Analyser rapport ventes juin', priority: 'medium' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: -8, assigneeId: 'user-2' },
  { title: 'Répondre à RFQ MediTech Solutions', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -3, assigneeId: 'user-1', companyIdx: 5 },
  { title: 'Corriger erreurs dans pipeline deals', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -14, assigneeId: 'user-4' },
  { title: 'Envoyer échantillons produits à client', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -5, assigneeId: 'user-2' },
  { title: 'Mettre à jour fiches contacts secteur santé', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -12, assigneeId: 'user-3' },
  { title: 'Vérifier conformité contrats en cours', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: -9, assigneeId: 'user-1' },
  { title: 'Préparer réunion direction commerciale', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -4, assigneeId: 'user-1' },
  { title: 'Relancer facture impayée client', priority: 'critical' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -2, assigneeId: 'user-4' },
  { title: 'Mettre à jour catalogue produits CRM', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: -20, assigneeId: 'user-3' },

  // Today tasks (15)
  { title: 'Appeler Atlas Logistique pour qualifier besoin', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-1', companyIdx: 0 },
  { title: 'Préparer démo produit pour Nour Cosmétiques', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-1', companyIdx: 1 },
  { title: 'Envoyer proposition commerciale à Digital Services', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-4', companyIdx: 7 },
  { title: 'Finaliser slides réunion équipe', priority: 'medium' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-2' },
  { title: 'Vérifier disponibilité salle pour atelier', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-3' },
  { title: 'Envoyer compte-rendu réunion à équipe', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-1' },
  { title: 'Mettre à jour statut leads sur CRM', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-2' },
  { title: 'Appeler Sarra pour confirmation rendez-vous', priority: 'low' as TaskPriority, status: 'done' as TaskStatus, daysOffset: 0, assigneeId: 'user-3' },
  { title: 'Commander fournitures bureau', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-4' },
  { title: 'Relire contrat avant envoi client', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-1' },
  { title: 'Planifier réunion équipe août', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-2' },
  { title: 'Vérifier pipeline opportunités chaudes', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-1' },
  { title: 'Mettre à jour calendrier partagé', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-3' },
  { title: 'Préparer dossier client pour demain', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 0, assigneeId: 'user-4' },
  { title: 'Vérifier notifications et rappels', priority: 'low' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 0, assigneeId: 'user-1' },

  // This week tasks (25)
  { title: 'Préparer démo produit — GreenEnergy', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 1, assigneeId: 'user-1', companyIdx: 6 },
  { title: 'Analyser données ventes semestre', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 2, assigneeId: 'user-2' },
  { title: 'Contacter prospects secteurs IT', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 1, assigneeId: 'user-3' },
  { title: 'Mettre à jour base contacts LinkedIn', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-4' },
  { title: 'Préparer rapport mensuel activité', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 2, assigneeId: 'user-2' },
  { title: 'Relancer opportunités en attente', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 1, assigneeId: 'user-1' },
  { title: 'Mettre à jour tarifs catalogue produit', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-4' },
  { title: 'Préparer argumentaire nouveau produit', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 2, assigneeId: 'user-3' },
  { title: 'Planifier campagnes emailing août', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 4, assigneeId: 'user-2' },
  { title: 'Vérifier conformité RGPD données', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 5, assigneeId: 'user-1' },
  { title: 'Préparer tableau reporting direction', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-2' },
  { title: 'Contacter fournisseur pour renouvellement', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 4, assigneeId: 'user-4' },
  { title: 'Mettre à jour opportunités gagnées', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 2, assigneeId: 'user-3' },
  { title: 'Préparer formation CRM pour nouveau', priority: 'high' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 5, assigneeId: 'user-1' },
  { title: 'Analyser taux conversion leads', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-2' },
  { title: 'Mettre à jour document processus vente', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 5, assigneeId: 'user-4' },
  { title: 'Préparer devis pour client potentiel', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 2, assigneeId: 'user-1' },
  { title: 'Relancer contact chaud AgroPlus', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 1, assigneeId: 'user-3', companyIdx: 8 },
  { title: 'Vérifier pipeline opportunités perdues', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 4, assigneeId: 'user-1' },
  { title: 'Préparer revue deals avec direction', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-1' },
  { title: 'Organiser déjeuner client équipe', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 5, assigneeId: 'user-3' },
  { title: 'Mettre à jour KPIs tableau de bord', priority: 'medium' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 2, assigneeId: 'user-2' },
  { title: 'Préparer package onboarding client', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 4, assigneeId: 'user-4' },
  { title: 'Appeler référent sectoriel santé', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 3, assigneeId: 'user-3' },
  { title: 'Finaliser script appel prospection', priority: 'medium' as TaskPriority, status: 'in_progress' as TaskStatus, daysOffset: 1, assigneeId: 'user-2' },

  // Done tasks (15)
  { title: 'Mettre à jour fiche Sanad Pharma', priority: 'low' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -2, assigneeId: 'user-2', companyIdx: 3 },
  { title: 'Envoyer devis à Atlas Logistique', priority: 'high' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -3, assigneeId: 'user-1', companyIdx: 0 },
  { title: 'Préparer proposition Groupe Kawtar', priority: 'high' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -4, assigneeId: 'user-1', companyIdx: 2 },
  { title: 'Appeler prospect banque secteur', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -5, assigneeId: 'user-3' },
  { title: 'Mettre à jour catalogue CRM v2.1', priority: 'low' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -7, assigneeId: 'user-4' },
  { title: 'Finaliser bilan semestriel', priority: 'high' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -6, assigneeId: 'user-2' },
  { title: 'Envoyer échantillons Sanad Pharma', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -8, assigneeId: 'user-2', companyIdx: 3 },
  { title: 'Mettre à jour base leads LinkedIn', priority: 'low' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -10, assigneeId: 'user-3' },
  { title: 'Relancer devis MediTech Solutions', priority: 'high' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -5, assigneeId: 'user-1', companyIdx: 5 },
  { title: 'Préparer support visuel démo produit', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -4, assigneeId: 'user-3' },
  { title: 'Vérifier opportunités gagnées juillet', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -6, assigneeId: 'user-1' },
  { title: 'Mettre à jour reporting mensuel', priority: 'high' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -9, assigneeId: 'user-2' },
  { title: 'Commander goodies salon client', priority: 'low' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -12, assigneeId: 'user-4' },
  { title: 'Préparer argumentaire vente solution', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -7, assigneeId: 'user-1' },
  { title: 'Former nouveau stagiaire CRM', priority: 'medium' as TaskPriority, status: 'done' as TaskStatus, daysOffset: -14, assigneeId: 'user-1' },

  // Next week / future tasks (15)
  { title: 'Préparer atelier CRM pour équipe', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 7, assigneeId: 'user-1' },
  { title: 'Analyser concurrence secteur', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 8, assigneeId: 'user-3' },
  { title: 'Mettre à jour processus onboarding', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 10, assigneeId: 'user-4' },
  { title: 'Préparer campagne prospection août', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 7, assigneeId: 'user-2' },
  { title: 'Développer nouveau pitch commercial', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 9, assigneeId: 'user-1' },
  { title: 'Planifier rendez-vous fournisseurs', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 12, assigneeId: 'user-4' },
  { title: 'Réviser objectifs équipe août', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 7, assigneeId: 'user-2' },
  { title: 'Préparer rapport satisfaction client', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 14, assigneeId: 'user-3' },
  { title: 'Mettre à jour base documents partagés', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 11, assigneeId: 'user-4' },
  { title: 'Contacter partenaire intégration CRM', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 8, assigneeId: 'user-1' },
  { title: 'Préparer bilan activité mensuel', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 10, assigneeId: 'user-2' },
  { title: 'Organiser webinaire démo produit', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 14, assigneeId: 'user-1' },
  { title: 'Mettre à jour base de connaissances', priority: 'low' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 15, assigneeId: 'user-3' },
  { title: 'Préparer revue trimestrielle', priority: 'high' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 12, assigneeId: 'user-1' },
  { title: 'Finaliser plan action commercial', priority: 'medium' as TaskPriority, status: 'todo' as TaskStatus, daysOffset: 9, assigneeId: 'user-4' },
];

function buildTasks(): Task[] {
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'done', 'cancelled'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

  return taskTemplates.map((tmpl, idx) => {
    const dueDate = tmpl.daysOffset <= 0
      ? new Date(Date.now() + tmpl.daysOffset * 24 * 60 * 60 * 1000).toISOString()
      : inDaysAt(tmpl.daysOffset, 9, 0);

    const taskTags: TaskTag[] = [];
    if (tmpl.priority === 'high' || tmpl.priority === 'critical') taskTags.push(TASK_TAGS[0]!);
    if (tmpl.companyIdx !== undefined) taskTags.push(TASK_TAGS[2]!);
    else taskTags.push(TASK_TAGS[3]!);
    if (idx % 3 === 0) taskTags.push(TASK_TAGS[4]!);
    if (idx % 5 === 0) taskTags.push(TASK_TAGS[5]!);

    const comments: TaskComment[] = tmpl.status !== 'todo' ? [
      {
        id: generateId(),
        authorId: USERS[Math.floor(Math.random() * USERS.length)]!.id,
        authorName: USERS[Math.floor(Math.random() * USERS.length)]!.name,
        content: 'J\'ai avancé sur cette tâche. À suivre.',
        createdAt: hoursAgo(Math.floor(Math.random() * 48) + 1),
      },
      {
        id: generateId(),
        authorId: USERS[Math.floor(Math.random() * USERS.length)]!.id,
        authorName: USERS[Math.floor(Math.random() * USERS.length)]!.name,
        content: 'Parfait, je valide la progression.',
        createdAt: hoursAgo(Math.floor(Math.random() * 24) + 1),
      },
    ] : [];

    const activities: TaskActivity[] = [
      {
        id: generateId(),
        type: 'created',
        actorName: USERS.find(u => u.id === tmpl.assigneeId)?.name ?? 'Alex Martin',
        description: `Tâche "${tmpl.title}" créée`,
        timestamp: daysAgo(14 + Math.floor(Math.random() * 30)),
      },
    ];

    if (tmpl.status === 'in_progress') {
      activities.push({
        id: generateId(),
        type: 'status_change',
        actorName: USERS.find(u => u.id === tmpl.assigneeId)?.name ?? 'Alex Martin',
        description: 'Statut changé à "En cours"',
        timestamp: hoursAgo(Math.floor(Math.random() * 72) + 1),
      });
    }

    if (tmpl.status === 'done') {
      activities.push({
        id: generateId(),
        type: 'status_change',
        actorName: USERS.find(u => u.id === tmpl.assigneeId)?.name ?? 'Alex Martin',
        description: 'Tâche marquée comme terminée',
        timestamp: hoursAgo(Math.floor(Math.random() * 48) + 1),
      });
    }

    const subtasks: Subtask[] = [
      {
        id: generateId(),
        title: 'Phase préparatoire',
        completed: tmpl.status !== 'todo',
        createdAt: daysAgo(10 + Math.floor(Math.random() * 10)),
      },
      {
        id: generateId(),
        title: 'Exécution',
        completed: tmpl.status === 'done',
        createdAt: daysAgo(5 + Math.floor(Math.random() * 5)),
      },
      {
        id: generateId(),
        title: 'Validation',
        completed: tmpl.status === 'done',
        createdAt: daysAgo(2 + Math.floor(Math.random() * 3)),
      },
    ];

    return {
      id: `task-${String(idx + 1).padStart(3, '0')}`,
      title: tmpl.title,
      description: `Description détaillée pour: ${tmpl.title}. Cette tâche nécessite une attention particulière et un suivi rigoureux.`,
      status: tmpl.status,
      priority: tmpl.priority,
      dueDate,
      assigneeId: tmpl.assigneeId,
      assigneeName: USERS.find(u => u.id === tmpl.assigneeId)?.name ?? 'Alex Martin',
      relatedEntity: tmpl.companyIdx !== undefined ? 'company' : undefined,
      relatedEntityId: tmpl.companyIdx !== undefined ? COMPANIES[tmpl.companyIdx]?.id : undefined,
      relatedEntityName: tmpl.companyIdx !== undefined ? COMPANIES[tmpl.companyIdx]?.name : undefined,
      tags: taskTags,
      comments,
      documents: [],
      subtasks,
      activities,
      notes: tmpl.status === 'done' ? 'Tâche terminée avec succès.' : 'Priorité à suivre cette semaine.',
      createdAt: daysAgo(14 + Math.floor(Math.random() * 30)),
      updatedAt: dueDate,
    };
  });
}

export const tasksMock: Task[] = buildTasks();

/* ══════════════════════════════════════════════════════════════
   EXPORT ALL MOCK DATA
   ══════════════════════════════════════════════════════════════ */
export const calendarMockData = {
  events: eventsMock,
  tasks: tasksMock,
  users: USERS,
  companies: COMPANIES,
  contacts: CONTACTS,
  tags: TASK_TAGS,
};

