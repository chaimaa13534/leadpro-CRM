/* ═════════════════════════════════════════════════════════════════════
   Notifications & Activity Center — Mock Data
   250 notifications + 500 CRM activities (simulated)
   ═════════════════════════════════════════════════════════════════════ */

import type {
  Notification,
  NotificationSettings,
  NotificationPriority,
  NotificationType,
  NotificationModule,
  NotificationStatus,
} from '@/types/notification.types';

import type {
  Activity,
  ActivityType,
} from '@/types/activity.types';

import { daysAgo, hoursAgo, todayAt } from '@/mocks/mock-date-helpers';

/* ── Users ── */
const users = [
  { id: 'user-1', name: 'Alex Martin', avatar: undefined },
  { id: 'user-2', name: 'Sara Idrissi', avatar: undefined },
  { id: 'user-3', name: 'Yassine Bennani', avatar: undefined },
  { id: 'user-4', name: 'Omar Chraibi', avatar: undefined },
  { id: 'user-5', name: 'Leila Kabiri', avatar: undefined },
  { id: 'user-6', name: 'Mehdi Touati', avatar: undefined },
  { id: 'user-7', name: 'Mounia Ouazzani', avatar: undefined },
  { id: 'user-8', name: 'Karim Benali', avatar: undefined },
];

/* ── Helper to pick random item ── */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ── Notification templates ── */
interface NotificationTemplate {
  type: NotificationType;
  module: NotificationModule;
  priority: NotificationPriority;
  titleGen: (user: string, entity: string) => string;
  messageGen: (user: string, entity: string) => string;
}

const notificationTemplates: NotificationTemplate[] = [
  {
    type: 'lead_created',
    module: 'leads',
    priority: 'normal',
    titleGen: (u, e) => `Nouveau lead créé par ${u}`,
    messageGen: (_, e) => `${e} a été ajouté comme nouveau lead dans le pipeline.`,
  },
  {
    type: 'lead_updated',
    module: 'leads',
    priority: 'low',
    titleGen: (u, e) => `Lead modifié par ${u}`,
    messageGen: (_, e) => `Les informations du lead ${e} ont été mises à jour.`,
  },
  {
    type: 'contact_created',
    module: 'contacts',
    priority: 'normal',
    titleGen: (u, e) => `Nouveau contact créé par ${u}`,
    messageGen: (_, e) => `${e} a été ajouté à la base de contacts.`,
  },
  {
    type: 'company_created',
    module: 'companies',
    priority: 'normal',
    titleGen: (u, e) => `Nouvelle entreprise créée par ${u}`,
    messageGen: (_, e) => `${e} a été ajoutée au portefeuille clients.`,
  },
  {
    type: 'opportunity_created',
    module: 'opportunities',
    priority: 'high',
    titleGen: (u, e) => `Nouvelle opportunité créée par ${u}`,
    messageGen: (_, e) => `Une nouvelle opportunité de ${e} a été ouverte.`,
  },
  {
    type: 'pipeline_moved',
    module: 'pipeline',
    priority: 'high',
    titleGen: (_, e) => `Déplacement dans le pipeline`,
    messageGen: (u, e) => `${u} a déplacé ${e} vers une nouvelle étape du pipeline.`,
  },
  {
    type: 'meeting_scheduled',
    module: 'meetings',
    priority: 'normal',
    titleGen: (u, e) => `Réunion programmée par ${u}`,
    messageGen: (_, e) => `Une réunion a été planifiée : ${e}.`,
  },
  {
    type: 'task_assigned',
    module: 'tasks',
    priority: 'high',
    titleGen: (u, e) => `Tâche assignée par ${u}`,
    messageGen: (_, e) => `La tâche "${e}" vous a été assignée.`,
  },
  {
    type: 'report_generated',
    module: 'reports',
    priority: 'low',
    titleGen: (_, e) => `Rapport généré`,
    messageGen: (u, e) => `${u} a généré un rapport : ${e}.`,
  },
  {
    type: 'user_login',
    module: 'system',
    priority: 'low',
    titleGen: (u, _) => `Connexion utilisateur`,
    messageGen: (u, _) => `${u} s'est connecté à la plateforme.`,
  },
  {
    type: 'comment',
    module: 'leads',
    priority: 'normal',
    titleGen: (u, e) => `Nouveau commentaire de ${u}`,
    messageGen: (_, e) => `Un commentaire a été ajouté sur ${e}.`,
  },
  {
    type: 'mention',
    module: 'mentions',
    priority: 'urgent',
    titleGen: (u, _) => `${u} vous a mentionné`,
    messageGen: (u, e) => `${u} vous a mentionné dans ${e}.`,
  },
  {
    type: 'system_alert',
    module: 'system',
    priority: 'urgent',
    titleGen: (_, e) => `Alerte système`,
    messageGen: (_, e) => `${e} — une action est requise.`,
  },
  {
    type: 'info',
    module: 'system',
    priority: 'low',
    titleGen: (_, e) => `Information`,
    messageGen: (u, e) => `${e}`,
  },
  {
    type: 'success',
    module: 'opportunities',
    priority: 'normal',
    titleGen: (u, e) => `Opportunité gagnée 🎉`,
    messageGen: (u, e) => `${u} a remporté l'opportunité ${e} !`,
  },
  {
    type: 'warning',
    module: 'pipeline',
    priority: 'high',
    titleGen: (_, e) => `Alerte pipeline`,
    messageGen: (u, e) => `${e} est bloqué depuis plus de 7 jours.`,
  },
  {
    type: 'error',
    module: 'system',
    priority: 'urgent',
    titleGen: (_, e) => `Erreur système`,
    messageGen: (_, e) => `Une erreur est survenue : ${e}.`,
  },
  {
    type: 'task_reminder',
    module: 'tasks',
    priority: 'high',
    titleGen: (_, e) => `Rappel de tâche`,
    messageGen: (_, e) => `La tâche "${e}" est due aujourd'hui.`,
  },
];

/* ── Entity names for notifications ── */
const leadNames = [
  'Sophie Martin', 'Jean Dupont', 'Emily Chen', 'Mohammed Alami',
  'Laura Garcia', 'Thomas Bernard', 'Anna Kowalski', 'Carlos Silva',
  'Priya Patel', 'Hans Mueller', 'Yuki Tanaka', 'Maria Rossi',
];

const companyNames = [
  'TechNova Solutions', 'GreenField Industries', 'DigiMark Agency',
  'CloudPeak Systems', 'BlueOcean Ventures', 'DataPulse Analytics',
  'EcoSmart Energy', 'NextGen Robotics', 'PixelPerfect Design',
  'QuantumLeap Technologies', 'StarLink Communications', 'BioHealth Labs',
];

const opportunityNames = [
  'Projet CRM Premium', 'Migration Cloud', 'Refonte Site E-commerce',
  'Solution BI Sur-Mesure', 'Déploiement ERP', 'Campagne Marketing Digital',
  'Audit Sécurité', 'Formation Équipe Commerciale', 'Application Mobile',
  'Infrastructure Réseau', 'Consulting Stratégique', 'Support Technique Premium',
];

const meetingTitles = [
  'Revue hebdomadaire équipe', 'Démo client TechNova',
  'Appel découverte GreenField', 'Atelier stratégie Q3',
  'Point commercial mensuel', 'Formation produit DigiMark',
  'Réunion bilan CloudPeak', 'Sprint planning équipe dev',
];

const taskNames = [
  'Relancer le lead Sophie Martin', 'Préparer proposition commerciale',
  'Mettre à jour fiche contact', 'Analyser rapport mensuel',
  'Planifier démo produit', 'Suivre opportunité CloudPeak',
  'Rédiger compte-rendu réunion', 'Vérifier pipeline ventes',
];

const alertMessages = [
  'Limite de stockage atteinte à 90%',
  'Mise à jour de sécurité disponible',
  'Certificat SSL expire dans 7 jours',
  'Sauvegarde automatique échouée',
  'Nouvelle version de l\'application disponible',
];

const commentNotes = [
  'suivi du lead', 'la fiche contact', 'l\'opportunité en cours',
  'le dossier client', 'le pipeline de vente', 'la réunion précédente',
];

const reportNames = [
  'Rapport ventes mensuel', 'Analyse pipeline Q3',
  'Performance équipe commerciale', 'Prévisions revenus',
  'Rapport leads entrants', 'Analyse opportunités perdues',
];

/* ── Generate 250 notifications ── */
function generateNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const now = Date.now();

  for (let i = 0; i < 250; i++) {
    const template = pick(notificationTemplates);
    const author = pick(users);
    const entity = pick([
      ...leadNames,
      ...companyNames,
      ...opportunityNames,
      ...meetingTitles,
      ...taskNames,
      ...alertMessages,
      ...reportNames,
    ]);

    const hoursBack = Math.floor(Math.random() * 720); // up to 30 days
    const createdAt = new Date(now - hoursBack * 60 * 60 * 1000).toISOString();
    const isRead = Math.random() > 0.4;
    const status: NotificationStatus = isRead ? (Math.random() > 0.3 ? 'read' : 'archived') : 'unread';

    notifications.push({
      id: `notif-${i + 1}`,
      recipientId: 'user-1',
      type: template.type,
      title: template.titleGen(author.name, entity),
      message: template.messageGen(author.name, entity),
      isRead,
      status,
      priority: template.priority,
      module: template.module,
      authorId: author.id,
      authorName: author.name,
      authorAvatarUrl: author.avatar,
      linkTo: Math.random() > 0.5 ? '/leads/lead-1' : undefined,
      relatedEntityId: `entity-${Math.floor(Math.random() * 100)}`,
      relatedEntityName: entity,
      createdAt,
      readAt: isRead ? new Date(now - (hoursBack - 1) * 60 * 60 * 1000).toISOString() : undefined,
      archivedAt: status === 'archived' ? new Date(now - (hoursBack - 2) * 60 * 60 * 1000).toISOString() : undefined,
    });
  }

  // Sort by createdAt descending
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/* ── Generate 500 CRM activities ── */
function generateActivities(): Activity[] {
  const activities: Activity[] = [];
  const now = Date.now();

  const activityTypeConfigs: { type: ActivityType; modules: Activity['module'][] }[] = [
    { type: 'lead_created', modules: ['leads'] },
    { type: 'lead_updated', modules: ['leads'] },
    { type: 'lead_deleted', modules: ['leads'] },
    { type: 'contact_created', modules: ['contacts'] },
    { type: 'contact_updated', modules: ['contacts'] },
    { type: 'contact_deleted', modules: ['contacts'] },
    { type: 'company_created', modules: ['companies'] },
    { type: 'company_updated', modules: ['companies'] },
    { type: 'company_deleted', modules: ['companies'] },
    { type: 'opportunity_created', modules: ['opportunities'] },
    { type: 'opportunity_updated', modules: ['opportunities'] },
    { type: 'opportunity_won', modules: ['opportunities'] },
    { type: 'opportunity_lost', modules: ['opportunities'] },
    { type: 'pipeline_moved', modules: ['pipeline', 'opportunities'] },
    { type: 'meeting_scheduled', modules: ['meetings'] },
    { type: 'meeting_completed', modules: ['meetings'] },
    { type: 'task_created', modules: ['tasks'] },
    { type: 'task_completed', modules: ['tasks'] },
    { type: 'task_updated', modules: ['tasks'] },
    { type: 'comment_added', modules: ['leads', 'contacts', 'opportunities'] },
    { type: 'note_added', modules: ['leads', 'contacts', 'companies'] },
    { type: 'user_login', modules: ['communications'] },
    { type: 'report_generated', modules: ['reports'] },
    { type: 'email_sent', modules: ['communications'] },
    { type: 'call_made', modules: ['communications'] },
  ];

  const activityDescriptions: Record<ActivityType, (actor: string, entity: string, details?: string) => string> = {
    lead_created: (a, e) => `${a} a créé un nouveau lead : ${e}`,
    lead_updated: (a, e) => `${a} a modifié le lead ${e}`,
    lead_deleted: (a, e) => `${a} a supprimé le lead ${e}`,
    contact_created: (a, e) => `${a} a ajouté ${e} comme nouveau contact`,
    contact_updated: (a, e) => `${a} a mis à jour la fiche de ${e}`,
    contact_deleted: (a, e) => `${a} a supprimé le contact ${e}`,
    company_created: (a, e) => `${a} a créé l'entreprise ${e}`,
    company_updated: (a, e) => `${a} a modifié la fiche de ${e}`,
    company_deleted: (a, e) => `${a} a supprimé l'entreprise ${e}`,
    opportunity_created: (a, e) => `${a} a ouvert une nouvelle opportunité : ${e}`,
    opportunity_updated: (a, e) => `${a} a mis à jour l'opportunité ${e}`,
    opportunity_deleted: (a, e) => `${a} a supprimé l'opportunité ${e}`,
    opportunity_won: (a, e) => `${a} a remporté l'opportunité ${e} 🎉`,
    opportunity_lost: (a, e) => `${a} a perdu l'opportunité ${e}`,
    pipeline_moved: (a, e) => `${a} a déplacé ${e} dans le pipeline`,
    meeting_scheduled: (a, e) => `${a} a programmé une réunion : ${e}`,
    meeting_completed: (a, e) => `${a} a terminé la réunion "${e}"`,
    meeting_cancelled: (a, e) => `${a} a annulé la réunion "${e}"`,
    task_created: (a, e) => `${a} a créé la tâche "${e}"`,
    task_completed: (a, e) => `${a} a complété la tâche "${e}"`,
    task_updated: (a, e) => `${a} a modifié la tâche "${e}"`,
    comment_added: (a, e) => `${a} a commenté sur ${e}`,
    note_added: (a, e) => `${a} a ajouté une note à ${e}`,
    user_login: (a, _) => `${a} s'est connecté à la plateforme`,
    user_logout: (a, _) => `${a} s'est déconnecté`,
    report_generated: (a, e) => `${a} a généré le rapport "${e}"`,
    email_sent: (a, e) => `${a} a envoyé un email à ${e}`,
    call_made: (a, e) => `${a} a passé un appel à ${e}`,
  };

  const entityNames = [
    ...leadNames, ...companyNames, ...opportunityNames,
    'Sophie Martin', 'Pierre Dubois', 'Isabelle Laurent',
    'Nicolas Petit', 'Catherine Moreau', 'Antoine Roux',
  ];

  for (let i = 0; i < 500; i++) {
    const config = pick(activityTypeConfigs);
    const actor = pick(users);
    const entity = pick(entityNames);
    const module = pick(config.modules);
    const hoursBack = Math.floor(Math.random() * 1440); // up to 60 days

    const details = Math.random() > 0.7
      ? `Détails supplémentaires concernant cette action.`
      : undefined;

    activities.push({
      id: `activity-${i + 1}`,
      type: config.type,
      module,
      actorId: actor.id,
      actorName: actor.name,
      actorAvatarUrl: actor.avatar,
      actorRole: pick(['Manager Commercial', 'Sales Rep', 'Admin', 'Team Lead']),
      description: activityDescriptions[config.type](actor.name, entity),
      details,
      relatedEntityId: `entity-${Math.floor(Math.random() * 100)}`,
      relatedEntityName: entity,
      relatedEntityType: module.slice(0, -1),
      linkTo: Math.random() > 0.5 ? `/leads/lead-${Math.floor(Math.random() * 20)}` : undefined,
      metadata: Math.random() > 0.6 ? { source: pick(['Web', 'Email', 'Phone', 'Manual']), campaign: pick(['Q1', 'Q2', 'Q3', 'None']) } : undefined,
      occurredAt: new Date(now - hoursBack * 60 * 60 * 1000).toISOString(),
    });
  }

  return activities.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

/* ── Exports ── */
export const notificationsMock: Notification[] = generateNotifications();
export const activitiesMock: Activity[] = generateActivities();

/* ── Stats helpers ── */
export function getNotificationStats(notifs: Notification[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  return {
    total: notifs.length,
    unread: notifs.filter((n) => !n.isRead).length,
    today: notifs.filter((n) => new Date(n.createdAt) >= todayStart).length,
    thisWeek: notifs.filter((n) => new Date(n.createdAt) >= weekStart).length,
    mentions: notifs.filter((n) => n.type === 'mention').length,
    alerts: notifs.filter((n) => n.type === 'system_alert' || n.type === 'error' || n.type === 'warning').length,
    crmActivities: notifs.filter((n) => ['lead_created', 'lead_updated', 'contact_created', 'company_created', 'opportunity_created', 'pipeline_moved'].includes(n.type)).length,
  };
}

export function getActivityStats(acts: Activity[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: acts.length,
    today: acts.filter((a) => new Date(a.occurredAt) >= todayStart).length,
    thisWeek: acts.filter((a) => new Date(a.occurredAt) >= weekStart).length,
    thisMonth: acts.filter((a) => new Date(a.occurredAt) >= monthStart).length,
    byModule: acts.reduce<Record<string, number>>((acc, a) => {
      acc[a.module] = (acc[a.module] || 0) + 1;
      return acc;
    }, {}),
    byType: acts.reduce<Record<string, number>>((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {}),
  };
}

/* ── Default settings ── */
export const defaultNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  desktop: true,
  sms: false,
  lead: true,
  pipeline: true,
  tasks: true,
  meetings: true,
  reports: true,
  marketing: false,
  mentions: true,
  systemAlerts: true,
  digestFrequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

