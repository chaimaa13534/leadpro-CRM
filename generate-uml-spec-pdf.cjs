const { jsPDF } = require('jspdf');
const { autoTable } = require('jspdf-autotable');
const fs = require('fs');

const doc = new jsPDF({ unit: 'mm', format: 'a4' });
const margin = 16;
const pageHeight = 297;
let y = 18;

function header() {
  doc.setFillColor(20, 45, 80);
  doc.rect(0, 0, 210, 13, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('LeadPro CRM — Cahier des charges UML', margin, 8);
  doc.setTextColor(30, 41, 59);
}
function footer() {
  const n = doc.getNumberOfPages();
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(`Page ${n}`, 194, 288, { align: 'right' });
  doc.setTextColor(30, 41, 59);
}
function newPage() { footer(); doc.addPage(); header(); y = 21; }
function ensure(height) { if (y + height > 280) newPage(); }
function title(text) { ensure(14); doc.setTextColor(15, 58, 95); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text(text, margin, y); y += 9; doc.setDrawColor(14, 116, 144); doc.line(margin, y, 194, y); y += 6; doc.setTextColor(30, 41, 59); }
function heading(text) { ensure(10); doc.setTextColor(15, 58, 95); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(text, margin, y); y += 6; doc.setTextColor(30, 41, 59); }
function paragraph(text) { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); const lines = doc.splitTextToSize(text, 178); ensure(lines.length * 4.5 + 3); doc.text(lines, margin, y); y += lines.length * 4.5 + 3; }
function bullets(items) { items.forEach((item) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); const lines = doc.splitTextToSize(item, 170); ensure(lines.length * 4.5 + 2); doc.text('•', margin, y); doc.text(lines, margin + 5, y); y += lines.length * 4.5 + 2; }); y += 2; }
function table(head, body, widths) { ensure(24); autoTable(doc, { startY: y, margin: { left: margin, right: margin }, head: [head], body, theme: 'grid', styles: { fontSize: 7.4, cellPadding: 2, textColor: [30, 41, 59], overflow: 'linebreak' }, headStyles: { fillColor: [15, 58, 95] }, columnStyles: widths || {}, didDrawPage: () => { header(); } }); y = doc.lastAutoTable.finalY + 6; if (y > 276) newPage(); }

header();
doc.setFillColor(15, 58, 95); doc.roundedRect(16, 34, 178, 64, 4, 4, 'F');
doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(25); doc.text('Cahier des charges', 105, 58, { align: 'center' }); doc.text('LeadPro CRM', 105, 72, { align: 'center' });
doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text('Document de référence pour les diagrammes UML', 105, 86, { align: 'center' });
doc.setTextColor(30, 41, 59); y = 118;
paragraph('Version fondée sur l’implémentation actuelle du projet : frontend React/TypeScript, API REST Node.js/Express et base MySQL.');
heading('Diagrammes à produire');
bullets(['Diagramme de cas d’utilisation global et diagrammes par module.', 'Diagramme de classes du domaine et diagramme de composants/architecture.', 'Diagrammes de séquence : connexion, création d’opportunité et déplacement Kanban.', 'Diagrammes d’états : lead, opportunité, tâche et notification.']);
newPage();

title('1. Contexte et objectifs');
paragraph('LeadPro CRM est une application SaaS de gestion de la relation client destinée aux équipes commerciales. Elle centralise les prospects, entreprises, contacts, opportunités, tâches, pipeline de vente, notifications et indicateurs de performance.');
heading('Objectifs métier');
bullets(['Structurer le suivi des prospects et clients.', 'Gérer le cycle de vente, de la qualification à la clôture.', 'Affecter les dossiers et tâches aux membres de l’équipe.', 'Visualiser les opportunités dans un pipeline Kanban.', 'Produire des tableaux de bord et des rapports sécurisés par rôle.']);
heading('Architecture');
paragraph('Navigateur → Frontend React/TypeScript → API REST sécurisée par JWT → Routes → Middlewares → Controllers → Services → Repositories → Base MySQL. Le frontend ne dialogue jamais directement avec la base de données.');

title('2. Acteurs et droits');
table(['Acteur', 'Responsabilités'], [
  ['Administrateur', 'Gestion complète des utilisateurs et données métier.'],
  ['Manager', 'Supervision commerciale, création et modification des données, consultation des rapports.'],
  ['Commercial', 'Suivi des leads, contacts, opportunités et tâches ; création/modification autorisée selon module.'],
  ['Support', 'Consultation uniquement des données métier.'],
  ['Système CRM', 'Authentification, autorisation, persistance, notifications et calcul des KPI.'],
  ['Assistant IA', 'Fonction frontend prévue pour analyses et recommandations ; données actuellement simulées.']
], { 0: { cellWidth: 35 }, 1: { cellWidth: 143 } });
table(['Module', 'Admin', 'Manager', 'Commercial', 'Support'], [
  ['Utilisateurs', 'CRUD', '—', '—', '—'], ['Entreprises', 'CRUD', 'CRU', 'Lecture', 'Lecture'], ['Contacts', 'CRUD', 'CRU', 'CRU', 'Lecture'], ['Leads', 'CRUD', 'CRU', 'CRU', 'Lecture'], ['Opportunités / Pipeline / Tâches', 'CRUD', 'CRU', 'CRU', 'Lecture'], ['Rapports', 'Tous', 'Tous', 'Ses données', 'Lecture selon permission']
]);

title('3. Cas d’utilisation');
heading('UC-01 — Authentification');
paragraph('L’utilisateur saisit e-mail et mot de passe. Le système valide les données, retrouve un compte actif, compare le mot de passe avec son hash, génère un JWT, met à jour last_login et renvoie le profil public ainsi que le jeton. Les identifiants invalides retournent une erreur 401.');
heading('UC-02 — Gestion des utilisateurs');
paragraph('L’administrateur peut lister, rechercher, créer, consulter, modifier, activer/désactiver et supprimer logiquement les comptes. Un compte porte une identité, un rôle, un statut et des informations de contact.');
heading('UC-03 — Entreprises et contacts');
paragraph('Les utilisateurs autorisés créent, recherchent, filtrent, consultent et mettent à jour les entreprises et contacts. Un contact est obligatoirement rattaché à une entreprise et affecté à un responsable. Les vues détaillées affichent les données liées, notes et historiques.');
heading('UC-04 — Leads');
paragraph('Un lead représente un prospect qualifié par son statut, sa priorité, une valeur estimée, une source, un responsable et éventuellement une entreprise ou un contact. L’utilisateur peut le créer, le consulter, le filtrer, le modifier et le supprimer logiquement.');
heading('UC-05 — Opportunités et pipeline');
paragraph('Une opportunité est rattachée à une entreprise, un pipeline, une étape et un responsable ; elle peut viser un contact. L’utilisateur gère sa valeur, probabilité, date de clôture et statut. Le tableau Kanban affiche les opportunités par étape et permet leur déplacement.');
heading('UC-06 — Tâches, notifications et rapports');
paragraph('Les tâches sont affectées à un utilisateur et liées facultativement à une entreprise, un contact ou un lead. Les notifications sont propres à chaque utilisateur et peuvent être lues ou supprimées. Les rapports synthétisent l’activité pour une période sélectionnée.');

title('4. Règles de gestion');
bullets(['Toutes les ressources métier sont protégées par JWT ; seules la connexion et la route de santé sont publiques.', 'Les e-mails utilisateurs sont uniques et les mots de passe ne sont jamais exposés ni stockés en clair.', 'Les utilisateurs, entreprises, contacts, leads, opportunités et tâches utilisent la suppression logique via deleted_at.', 'Un contact doit appartenir à une entreprise.', 'Une opportunité doit référencer une entreprise, un responsable, un pipeline et une étape.', 'L’étape cible d’une opportunité doit appartenir au pipeline de cette opportunité.', 'Une tâche est affectée à un utilisateur ; ses liens métier sont facultatifs.', 'Les listes sont paginées, filtrables, recherchables et triables.', 'Une notification est créée, entre autres, lors d’affectations ou de changements importants d’opportunité.']);

title('5. Modèle de domaine');
table(['Classe', 'Attributs essentiels'], [
  ['Role', 'id, name, slug, description'], ['User', 'id, firstName, lastName, email, passwordHash, avatar?, phone?, isActive, lastLogin?, timestamps, deletedAt?'], ['Team / TeamMember', 'Team: id, name, description?, ownerId. TeamMember: id, teamId, userId, role.'], ['Company', 'id, name, industry?, website?, phone?, email?, adresse, city?, country?, notes?, ownerId, timestamps'], ['Contact', 'id, firstName, lastName, email?, phone?, position?, notes?, companyId, ownerId, timestamps'], ['LeadSource', 'id, name, description?'], ['Lead', 'id, companyId?, contactId?, ownerId, sourceId?, status, priority, estimatedValue, notes?, timestamps'], ['Pipeline', 'id, name, description?, isDefault, timestamps'], ['PipelineStage', 'id, pipelineId, name, position, color?, probability?, timestamps'], ['Opportunity', 'id, companyId, contactId?, ownerId, pipelineId, pipelineStageId, probability, value, expectedCloseDate?, status, timestamps'], ['Task', 'id, title, description?, assignedTo, relatedLead?, relatedCompany?, relatedContact?, dueDate?, priority, status, timestamps'], ['Notification', 'id, userId, title, message, type, isRead, readAt?, createdAt'], ['Activity', 'id, userId, entity, entityId?, action, description?, createdAt'], ['Setting', 'id, userId, theme, language, timezone, notificationsEnabled'], ['AIConversation / AIMessage', 'Conversation: id, userId, title?, context?. Message: id, conversationId, role, content, createdAt']
], { 0: { cellWidth: 43 }, 1: { cellWidth: 135 } });

title('6. Associations et cardinalités');
bullets(['Role 1 — 0..* User.', 'User 1 — 0..* Company, Contact, Lead, Opportunity, Task, Notification, Activity, CalendarEvent et AIConversation.', 'User 1 — 0..1 Setting.', 'User 0..* — 0..* Team, via TeamMember.', 'Company 1 — 0..* Contact, Lead, Opportunity et Task.', 'Contact 1 — 0..* Lead, Opportunity et Task.', 'LeadSource 1 — 0..* Lead.', 'Pipeline 1 — 1..* PipelineStage ; Pipeline 1 — 0..* Opportunity.', 'PipelineStage 1 — 0..* Opportunity.', 'Lead 1 — 0..* Task.', 'AIConversation 1 *— 1..* AIMessage (composition).']);
heading('Énumérations');
paragraph('LeadStatus = new | contacted | qualified | proposal | won | lost. OpportunityStatus = open | won | lost. Priority = low | medium | high. TaskStatus = pending | in_progress | completed | cancelled. EventType = meeting | call | reminder | task | event. Theme = light | dark | system. MessageRole = user | assistant.');

title('7. États et séquences');
heading('États');
bullets(['Lead : new → contacted → qualified → proposal → won ou lost.', 'Opportunité : open → won ou lost. Le déplacement Kanban change l’étape ; il ne change pas automatiquement le statut métier.', 'Tâche : pending → in_progress → completed ; pending/in_progress → cancelled.', 'Notification : non lue → lue → supprimée, ou non lue → supprimée.']);
heading('Séquence — Création d’une opportunité');
paragraph('Utilisateur → Frontend : soumet le formulaire. Frontend → API : POST /api/opportunities. API → AuthMiddleware puis PermissionMiddleware : vérifie JWT et droit create. API → Validation : valide le payload. Controller → OpportunityService : vérifie entreprise, contact, responsable, pipeline et étape. Le service vérifie que l’étape appartient au pipeline, enregistre l’opportunité, crée si nécessaire une notification, puis renvoie la ressource créée au frontend.');
heading('Séquence — Déplacement Kanban');
paragraph('Utilisateur → Frontend : déplace une carte. Frontend → API : PATCH /api/opportunities/{id}/stage. Le service charge l’opportunité et l’étape cible, vérifie l’appartenance de l’étape au pipeline, met à jour stageId et crée une notification de changement.');

title('8. API et périmètre');
table(['Ressource', 'Opérations exposées'], [
  ['/api/auth', 'login, utilisateur courant, logout'], ['/api/users', 'CRUD utilisateur, changement de statut, options'], ['/api/companies', 'CRUD et filtres'], ['/api/contacts', 'CRUD'], ['/api/leads', 'CRUD et sources'], ['/api/opportunities', 'CRUD, filtres, changement d’étape'], ['/api/pipelines', 'CRUD pipeline, étapes et tableau Kanban'], ['/api/tasks', 'CRUD, changement de statut'], ['/api/notifications', 'liste, compteur non lu, lecture, suppression'], ['/api/reports/overview', 'KPI consolidés par période'], ['/api/profile', 'consultation, modification, avatar, suppression'], ['/api/health', 'contrôle de disponibilité']
], { 0: { cellWidth: 47 }, 1: { cellWidth: 131 } });
heading('Limites actuelles');
paragraph('Le frontend prévoit aussi calendrier, activité, paramètres avancés, facturation, intégrations et assistant IA. Les tables correspondantes existent pour plusieurs de ces modules, mais leurs routes API complètes ne sont pas toutes implémentées. Elles doivent être représentées comme prévues ou partiellement simulées dans les diagrammes UML.');

footer();
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/cahier-des-charges-leadpro-uml.pdf', Buffer.from(doc.output('arraybuffer')));
