-- =====================================================================
-- LeadPro CRM — DONNÉES DE DÉMONSTRATION (SEED)
-- Jour 3 : Conception et création de la base de données MySQL
--
-- À exécuter APRÈS schema.sql.
-- Les IDs sont explicites pour garantir l'intégrité référentielle.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

USE `leadpro_crm`;

-- ---------------------------------------------------------------------
-- 1. ROLES
-- ---------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
  (1, 'Admin',    'admin',    'Accès complet à toutes les fonctionnalités'),
  (2, 'Manager',  'manager',  'Gère les équipes et les pipelines'),
  (3, 'Sales',    'sales',    'Gère les leads, contacts et opportunités'),
  (4, 'Support',  'support',  'Support client et gestion des tickets');

-- ---------------------------------------------------------------------
-- 2. USERS
-- password_hash = bcrypt('Password123!') — Jour 4
-- Mot de passe de démonstration pour tous les utilisateurs seedés :
--   Password123!
-- ---------------------------------------------------------------------
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `avatar`, `phone`, `role_id`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
  (1, 'Sarah', 'Léger', 'sarah.leger@leadpro.com', '$2b$10$.7SK/NX/bm5BH.KuY/V.Xufm.Gm7d9oqVqJry3ASJPUdIPJcFHupC', NULL, '+33 6 12 34 56 78', 1, TRUE, '2025-01-20 09:15:00', '2025-01-10 08:00:00', '2025-01-20 09:15:00'),
  (2, 'Marc', 'Dubois', 'marc.dubois@leadpro.com', '$2b$10$.7SK/NX/bm5BH.KuY/V.Xufm.Gm7d9oqVqJry3ASJPUdIPJcFHupC', NULL, '+33 6 98 76 54 32', 2, TRUE, '2025-01-19 14:30:00', '2025-01-10 08:05:00', '2025-01-19 14:30:00'),
  (3, 'Léa', 'Moreau', 'lea.moreau@leadpro.com', '$2b$10$.7SK/NX/bm5BH.KuY/V.Xufm.Gm7d9oqVqJry3ASJPUdIPJcFHupC', NULL, '+33 6 55 44 33 22', 3, TRUE, '2025-01-20 10:45:00', '2025-01-11 09:00:00', '2025-01-20 10:45:00');

-- ---------------------------------------------------------------------
-- 3. TEAMS
-- ---------------------------------------------------------------------
INSERT INTO `teams` (`id`, `name`, `description`, `owner_id`, `created_at`, `updated_at`) VALUES
  (1, 'Équipe France', 'Équipe de vente France', 2, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (2, 'Teams Enterprise', 'Équipe grands comptes', 2, '2025-01-12 09:05:00', '2025-01-12 09:05:00');

-- ---------------------------------------------------------------------
-- 4. TEAM_MEMBERS
-- ---------------------------------------------------------------------
INSERT INTO `team_members` (`id`, `team_id`, `user_id`, `role`, `created_at`, `updated_at`) VALUES
  (1, 1, 1, 'manager', '2025-01-12 09:10:00', '2025-01-12 09:10:00'),
  (2, 1, 3, 'member',  '2025-01-12 09:10:00', '2025-01-12 09:10:00'),
  (3, 2, 2, 'manager', '2025-01-12 09:10:00', '2025-01-12 09:10:00');

-- ---------------------------------------------------------------------
-- 5. COMPANIES
-- ---------------------------------------------------------------------
INSERT INTO `companies` (`id`, `name`, `industry`, `website`, `phone`, `email`, `address`, `city`, `country`, `notes`, `owner_id`, `created_at`, `updated_at`) VALUES
  (1, 'TechNova SAS',   'Technologie', 'https://technova.fr',     '+33 1 40 00 00 01', 'contact@technova.fr',     '12 rue de la Paix',      'Paris',    'France', 'Client stratégique', 1, '2025-01-13 09:00:00', '2025-01-13 09:00:00'),
  (2, 'GreenEnergy',    'Énergie',     'https://greenenergy.com', '+33 4 72 00 00 02', 'info@greenenergy.com',    '5 avenue des Champs',    'Lyon',     'France', 'Énergie renouvelable', 2, '2025-01-14 10:00:00', '2025-01-14 10:00:00'),
  (3, 'MediCare Plus',  'Santé',       'https://medicareplus.io', '+33 5 61 00 00 03', 'hello@medicareplus.io',   '8 boulevard Médical',    'Toulouse', 'France', 'Secteur de la santé', 3, '2025-01-15 11:00:00', '2025-01-15 11:00:00');

-- ---------------------------------------------------------------------
-- 6. CONTACTS
-- ---------------------------------------------------------------------
INSERT INTO `contacts` (`id`, `company_id`, `first_name`, `last_name`, `email`, `phone`, `position`, `owner_id`, `notes`, `created_at`, `updated_at`) VALUES
  (1, 1, 'Alice', 'Martin',  'alice.martin@technova.fr',     '+33 1 40 00 00 11', 'Directrice technique', 1, 'Décideuse technique', '2025-01-13 10:00:00', '2025-01-13 10:00:00'),
  (2, 1, 'Paul',   'Bernard', 'paul.bernard@technova.fr',     '+33 1 40 00 00 12', 'ACHAT',               1, 'Contact achats', '2025-01-13 10:05:00', '2025-01-13 10:05:00'),
  (3, 2, 'Julie',  'Petit',   'julie.petit@greenenergy.com',  '+33 4 72 00 00 21', 'Directrice générale', 2, 'Contact principal', '2025-01-14 11:00:00', '2025-01-14 11:00:00'),
  (4, 3, 'Thomas', 'Roux',    'thomas.roux@medicareplus.io',  '+33 5 61 00 00 31', 'Directeur des opérations', 3, 'Décideur', '2025-01-15 12:00:00', '2025-01-15 12:00:00');

-- ---------------------------------------------------------------------
-- 7. LEAD_SOURCES
-- ---------------------------------------------------------------------
INSERT INTO `lead_sources` (`id`, `name`, `description`) VALUES
  (1, 'Website',   'Formulaire du site web'),
  (2, 'LinkedIn',  'Prospection LinkedIn'),
  (3, 'Referral',  'Recommandation client'),
  (4, 'Email',     'Campagne email'),
  (5, 'Phone',     'Appel téléphonique'),
  (6, 'Event',     'Événement / salon'),
  (7, 'Other',     'Autre source');

-- ---------------------------------------------------------------------
-- 8. PIPELINES
-- ---------------------------------------------------------------------
INSERT INTO `pipelines` (`id`, `name`, `description`, `is_default`, `created_at`, `updated_at`) VALUES
  (1, 'Sales Pipeline', 'Pipeline de vente standard',     TRUE,  '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (2, 'Enterprise',     'Pipeline grands comptes',        FALSE, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (3, 'Renewal',        'Pipeline de renouvellement',     FALSE, '2025-01-12 09:00:00', '2025-01-12 09:00:00');

-- ---------------------------------------------------------------------
-- 9. PIPELINE_STAGES
-- ---------------------------------------------------------------------
INSERT INTO `pipeline_stages` (`id`, `pipeline_id`, `name`, `position`, `color`, `probability`, `created_at`, `updated_at`) VALUES
  (1, 1, 'New',         0, '#64748b', 0.10, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (2, 1, 'Qualified',   1, '#3b82f6', 0.30, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (3, 1, 'Proposal',    2, '#8b5cf6', 0.50, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (4, 1, 'Negotiation', 3, '#f59e0b', 0.70, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (5, 1, 'Won',         4, '#10b981', 1.00, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (6, 1, 'Lost',        5, '#ef4444', 0.00, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (7, 2, 'New',         0, '#64748b', 0.10, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (8, 2, 'Qualified',   1, '#3b82f6', 0.30, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (9, 2, 'Proposal',    2, '#8b5cf6', 0.50, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (10, 2, 'Negotiation', 3, '#f59e0b', 0.70, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (11, 2, 'Won',         4, '#10b981', 1.00, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (12, 2, 'Lost',        5, '#ef4444', 0.00, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (13, 3, 'Pending',     0, '#64748b', 0.10, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (14, 3, 'Renew',       1, '#3b82f6', 0.30, '2025-01-12 09:00:00', '2025-01-12 09:00:00'),
  (15, 3, 'Won',         2, '#10b981', 1.00, '2025-01-12 09:00:00', '2025-01-12 09:00:00');

-- ---------------------------------------------------------------------
-- 10. LEADS
-- ---------------------------------------------------------------------
INSERT INTO `leads` (`id`, `company_id`, `contact_id`, `owner_id`, `source_id`, `status`, `priority`, `estimated_value`, `notes`, `created_at`, `updated_at`) VALUES
  (1, 1, 1, 1, 1, 'qualified', 'high',   25000.00, 'Projet identifié, besoin confirmé', '2025-01-13 10:00:00', '2025-01-16 10:00:00'),
  (2, 2, 3, 2, 2, 'contacted', 'medium', 12000.00, 'Échange LinkedIn productif',      '2025-01-14 11:00:00', '2025-01-17 11:00:00'),
  (3, 3, 4, 3, 3, 'new',       'medium', 18000.00, 'Recommandation',                   '2025-01-15 12:00:00', '2025-01-15 12:00:00'),
  (4, NULL, NULL, 1, 4, 'new', 'low',    5000.00,  'Campagne email',                   '2025-01-18 09:00:00', '2025-01-18 09:00:00');

-- ---------------------------------------------------------------------
-- 11. OPPORTUNITIES
-- ---------------------------------------------------------------------
INSERT INTO `opportunities` (`id`, `company_id`, `contact_id`, `owner_id`, `pipeline_id`, `pipeline_stage_id`, `probability`, `value`, `expected_close_date`, `status`, `created_at`, `updated_at`) VALUES
  (1, 1, 1, 1, 1, 3, 0.50, 25000.00, '2025-03-15', 'open', '2025-01-16 10:00:00', '2025-01-16 10:00:00'),
  (2, 2, 3, 2, 1, 2, 0.30, 12000.00, '2025-04-01', 'open', '2025-01-17 11:00:00', '2025-01-17 11:00:00'),
  (3, 3, 4, 3, 1, 1, 0.10, 18000.00, '2025-04-20', 'open', '2025-01-18 12:00:00', '2025-01-18 12:00:00'),
  (4, 1, 2, 1, 2, 9, 0.50, 45000.00, '2025-05-10', 'open', '2025-01-19 09:00:00', '2025-01-19 09:00:00');

-- ---------------------------------------------------------------------
-- 12. TASKS
-- ---------------------------------------------------------------------
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `related_lead`, `related_company`, `related_contact`, `due_date`, `priority`, `status`, `created_at`, `updated_at`) VALUES
  (1, 'Appeler Alice Martin', 'Présenter la proposition TechNova', 1, 1, 1, 1, '2025-01-25', 'high',   'pending',    '2025-01-20 09:00:00', '2025-01-20 09:00:00'),
  (2, 'Envoyer devis GreenEnergy', 'Préparer la proposition tarifaire', 2, 2, 2, 3, '2025-01-26', 'medium', 'in_progress', '2025-01-20 10:00:00', '2025-01-20 10:00:00'),
  (3, 'Relancer MediCare Plus', 'Relance après réunion', 3, 3, 3, 4, '2025-01-27', 'low',    'pending',    '2025-01-20 11:00:00', '2025-01-20 11:00:00');

-- ---------------------------------------------------------------------
-- 13. CALENDAR_EVENTS
-- ---------------------------------------------------------------------
INSERT INTO `calendar_events` (`id`, `title`, `description`, `start_at`, `end_at`, `owner_id`, `type`, `created_at`, `updated_at`) VALUES
  (1, 'Réunion TechNova', 'Présentation de la solution', '2025-01-25 09:00:00', '2025-01-25 10:00:00', 1, 'meeting', '2025-01-20 09:00:00', '2025-01-20 09:00:00'),
  (2, 'Appel GreenEnergy', 'Point trimestriel', '2025-01-26 14:00:00', '2025-01-26 14:30:00', 2, 'call',    '2025-01-20 10:00:00', '2025-01-20 10:00:00');

-- ---------------------------------------------------------------------
-- 14. ACTIVITIES
-- ---------------------------------------------------------------------
INSERT INTO `activities` (`id`, `user_id`, `entity`, `entity_id`, `action`, `description`, `created_at`) VALUES
  (1, 1, 'company', 1, 'created', 'Création de l entreprise TechNova', '2025-01-13 09:00:00'),
  (2, 1, 'lead',    1, 'qualified', 'Lead TechNova qualifié', '2025-01-16 10:00:00'),
  (3, 2, 'opportunity', 2, 'created', 'Création opport- GreenEnergy', '2025-01-17 11:00:00');

-- ---------------------------------------------------------------------
-- 15. NOTIFICATIONS
-- ---------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `read_at`, `created_at`) VALUES
  (1, 1, 'Nouveau lead', 'Un nouveau lead a été assigné à votre équipe.', 'info', FALSE, NULL, '2025-01-20 09:00:00'),
  (2, 1, 'Tâche à échéance', 'La tâche "Appeler Alice Martin" arrive à échéance.', 'warning', FALSE, NULL, '2025-01-20 09:00:00'),
  (3, 2, 'Opportunité gagnée', 'L opportunité GreenEnergy a été avancée.', 'success', TRUE, '2025-01-20 10:00:00', '2025-01-20 10:00:00');

-- ---------------------------------------------------------------------
-- 16. SETTINGS
-- ---------------------------------------------------------------------
INSERT INTO `settings` (`id`, `user_id`, `theme`, `language`, `timezone`, `notifications_enabled`, `created_at`, `updated_at`) VALUES
  (1, 1, 'dark',   'fr', 'Europe/Paris', TRUE,  '2025-01-10 08:00:00', '2025-01-10 08:00:00'),
  (2, 2, 'system', 'fr', 'Europe/Paris', TRUE,  '2025-01-10 08:05:00', '2025-01-10 08:05:00'),
  (3, 3, 'light',  'en', 'Europe/Paris', FALSE, '2025-01-11 09:00:00', '2025-01-11 09:00:00');

-- ---------------------------------------------------------------------
-- 17. AI_CONVERSATIONS
-- ---------------------------------------------------------------------
INSERT INTO `ai_conversations` (`id`, `user_id`, `title`, `context`, `created_at`, `updated_at`) VALUES
  (1, 1, 'Analyse des leads', 'Analyse de la performance du pipeline', '2025-01-20 09:30:00', '2025-01-20 09:30:00');

-- ---------------------------------------------------------------------
-- 18. AI_MESSAGES
-- ---------------------------------------------------------------------
INSERT INTO `ai_messages` (`id`, `conversation_id`, `role`, `content`, `created_at`) VALUES
  (1, 1, 'user',      'Analyse mes leads qualifiés pour ce mois.', '2025-01-20 09:30:00'),
  (2, 1, 'assistant', 'Vous avez 1 lead qualifié (TechNova) représentant 25 000 € de valeur estimée.', '2025-01-20 09:30:05');

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- FIN DU SEED — Données de démonstration insérées
-- =====================================================================
