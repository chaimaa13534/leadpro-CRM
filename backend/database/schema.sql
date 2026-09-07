-- =====================================================================
-- LeadPro CRM — SCHÉMA DE BASE DE DONNÉES
-- Jour 3 : Conception et création de la base de données MySQL
--
-- Moteur : InnoDB / Charset : utf8mb4
-- Compatible XAMPP (MySQL 8 / MariaDB 10.4+)
--
-- Ordre de création : respecte les dépendances (FK)
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Création de la base
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `leadpro_crm`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `leadpro_crm`;

-- =====================================================================
-- 1. ROLES
-- Rôles applicatifs du CRM : Admin, Manager, Sales, Support
-- =====================================================================
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,
  `slug`        VARCHAR(50)  NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`),
  UNIQUE KEY `uq_roles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 2. USERS
-- Utilisateurs du CRM (soft delete via deleted_at)
-- =====================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name`    VARCHAR(100) NOT NULL,
  `last_name`     VARCHAR(100) NOT NULL,
  `email`         VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  -- Image de profil encod?e en data URL (base64). MEDIUMTEXT couvre une
  -- image source de 10 Mo apr?s l'encodage base64.
  `avatar`        MEDIUMTEXT NULL,
  `phone`         VARCHAR(30)  NULL,
  `role_id`       INT UNSIGNED NOT NULL,
  `is_active`     BOOLEAN      NOT NULL DEFAULT TRUE,
  `last_login`    DATETIME     NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME     NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role_id` (`role_id`),
  KEY `idx_users_is_active` (`is_active`),
  KEY `idx_users_created_at` (`created_at`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 3. TEAMS
-- Équipes de vente
-- =====================================================================
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT         NULL,
  `owner_id`    INT UNSIGNED NOT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME     NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_teams_name` (`name`),
  KEY `idx_teams_owner_id` (`owner_id`),
  CONSTRAINT `fk_teams_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 4. TEAM_MEMBERS
-- Table de liaison users <-> teams
-- =====================================================================
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_id`    INT UNSIGNED NOT NULL,
  `user_id`    INT UNSIGNED NOT NULL,
  `role`       VARCHAR(50)  NOT NULL DEFAULT 'member',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_team_members_team_user` (`team_id`, `user_id`),
  KEY `idx_team_members_user_id` (`user_id`),
  CONSTRAINT `fk_team_members_team` FOREIGN KEY (`team_id`)
    REFERENCES `teams` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_team_members_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. COMPANIES
-- Entreprises / comptes clients (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(190) NOT NULL,
  `industry`   VARCHAR(100) NULL,
  `website`    VARCHAR(255) NULL,
  `phone`      VARCHAR(30)  NULL,
  `email`      VARCHAR(190) NULL,
  `address`    VARCHAR(255) NULL,
  `city`       VARCHAR(100) NULL,
  `country`    VARCHAR(100) NULL,
  `notes`      TEXT         NULL,
  `owner_id`   INT UNSIGNED NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME     NULL,
  PRIMARY KEY (`id`),
  KEY `idx_companies_name` (`name`),
  KEY `idx_companies_industry` (`industry`),
  KEY `idx_companies_owner_id` (`owner_id`),
  KEY `idx_companies_created_at` (`created_at`),
  CONSTRAINT `fk_companies_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 6. CONTACTS
-- Contacts associés aux entreprises (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name`  VARCHAR(100) NOT NULL,
  `email`      VARCHAR(190) NULL,
  `phone`      VARCHAR(30)  NULL,
  `position`   VARCHAR(100) NULL,
  `owner_id`   INT UNSIGNED NOT NULL,
  `notes`      TEXT         NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME     NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_company_id` (`company_id`),
  KEY `idx_contacts_owner_id` (`owner_id`),
  KEY `idx_contacts_email` (`email`),
  KEY `idx_contacts_name` (`last_name`, `first_name`),
  KEY `idx_contacts_created_at` (`created_at`),
  CONSTRAINT `fk_contacts_company` FOREIGN KEY (`company_id`)
    REFERENCES `companies` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_contacts_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 7. LEAD_SOURCES
-- Sources d'acquisition des leads
-- =====================================================================
DROP TABLE IF EXISTS `lead_sources`;
CREATE TABLE `lead_sources` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_lead_sources_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 8. PIPELINES
-- Pipelines de vente
-- =====================================================================
DROP TABLE IF EXISTS `pipelines`;
CREATE TABLE `pipelines` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `is_default`  BOOLEAN      NOT NULL DEFAULT FALSE,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pipelines_name` (`name`),
  KEY `idx_pipelines_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 9. PIPELINE_STAGES
-- Étapes d'un pipeline (New, Qualified, Proposal, Negotiation, Won, Lost)
-- =====================================================================
DROP TABLE IF EXISTS `pipeline_stages`;
CREATE TABLE `pipeline_stages` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pipeline_id`  INT UNSIGNED NOT NULL,
  `name`         VARCHAR(100) NOT NULL,
  `position`     INT          NOT NULL DEFAULT 0,
  `color`        VARCHAR(20)  NULL,
  `probability`  DECIMAL(5,2) NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_stages_pipeline_position` (`pipeline_id`, `position`),
  UNIQUE KEY `uq_stages_pipeline_name` (`pipeline_id`, `name`),
  KEY `idx_stages_pipeline_id` (`pipeline_id`),
  CONSTRAINT `fk_stages_pipeline` FOREIGN KEY (`pipeline_id`)
    REFERENCES `pipelines` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 10. LEADS
-- Prospects (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`       INT UNSIGNED NULL,
  `contact_id`       INT UNSIGNED NULL,
  `owner_id`         INT UNSIGNED NOT NULL,
  `source_id`        INT UNSIGNED NULL,
  `status`           ENUM('new','contacted','qualified','proposal','won','lost') NOT NULL DEFAULT 'new',
  `priority`         ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  `estimated_value`  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `notes`            TEXT NULL,
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`       DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_leads_owner_id` (`owner_id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_priority` (`priority`),
  KEY `idx_leads_source_id` (`source_id`),
  KEY `idx_leads_company_id` (`company_id`),
  KEY `idx_leads_contact_id` (`contact_id`),
  KEY `idx_leads_created_at` (`created_at`),
  CONSTRAINT `fk_leads_company` FOREIGN KEY (`company_id`)
    REFERENCES `companies` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_leads_contact` FOREIGN KEY (`contact_id`)
    REFERENCES `contacts` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_leads_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_leads_source` FOREIGN KEY (`source_id`)
    REFERENCES `lead_sources` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 11. OPPORTUNITIES
-- Opportunités de vente liées aux pipelines (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `opportunities`;
CREATE TABLE `opportunities` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id`          INT UNSIGNED NOT NULL,
  `contact_id`          INT UNSIGNED NULL,
  `owner_id`            INT UNSIGNED NOT NULL,
  `pipeline_id`         INT UNSIGNED NOT NULL,
  `pipeline_stage_id`   INT UNSIGNED NOT NULL,
  `probability`         DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  `value`               DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `expected_close_date` DATE NULL,
  `status`              ENUM('open','won','lost') NOT NULL DEFAULT 'open',
  `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_opportunities_owner_id` (`owner_id`),
  KEY `idx_opportunities_company_id` (`company_id`),
  KEY `idx_opportunities_contact_id` (`contact_id`),
  KEY `idx_opportunities_pipeline_id` (`pipeline_id`),
  KEY `idx_opportunities_stage_id` (`pipeline_stage_id`),
  KEY `idx_opportunities_status` (`status`),
  KEY `idx_opportunities_close_date` (`expected_close_date`),
  KEY `idx_opportunities_value` (`value`),
  CONSTRAINT `fk_opportunities_company` FOREIGN KEY (`company_id`)
    REFERENCES `companies` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_opportunities_contact` FOREIGN KEY (`contact_id`)
    REFERENCES `contacts` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_opportunities_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_opportunities_pipeline` FOREIGN KEY (`pipeline_id`)
    REFERENCES `pipelines` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_opportunities_stage` FOREIGN KEY (`pipeline_stage_id`)
    REFERENCES `pipeline_stages` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 12. TASKS
-- Tâches liées aux leads / entreprises / contacts (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`            VARCHAR(190) NOT NULL,
  `description`      TEXT NULL,
  `assigned_to`      INT UNSIGNED NOT NULL,
  `related_lead`     INT UNSIGNED NULL,
  `related_company`  INT UNSIGNED NULL,
  `related_contact`  INT UNSIGNED NULL,
  `due_date`         DATE NULL,
  `priority`         ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  `status`           ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`       DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_assigned_to` (`assigned_to`),
  KEY `idx_tasks_status` (`status`),
  KEY `idx_tasks_due_date` (`due_date`),
  KEY `idx_tasks_priority` (`priority`),
  KEY `idx_tasks_related_lead` (`related_lead`),
  KEY `idx_tasks_related_company` (`related_company`),
  KEY `idx_tasks_related_contact` (`related_contact`),
  CONSTRAINT `fk_tasks_assigned_to` FOREIGN KEY (`assigned_to`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_tasks_lead` FOREIGN KEY (`related_lead`)
    REFERENCES `leads` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_company` FOREIGN KEY (`related_company`)
    REFERENCES `companies` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_contact` FOREIGN KEY (`related_contact`)
    REFERENCES `contacts` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 13. CALENDAR_EVENTS
-- Événements du calendrier (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `calendar_events`;
CREATE TABLE `calendar_events` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(190) NOT NULL,
  `description` TEXT NULL,
  `start_at`    DATETIME NOT NULL,
  `end_at`      DATETIME NULL,
  `owner_id`    INT UNSIGNED NOT NULL,
  `type`        ENUM('meeting','call','reminder','task','event') NOT NULL DEFAULT 'event',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_events_owner_id` (`owner_id`),
  KEY `idx_events_start_at` (`start_at`),
  KEY `idx_events_type` (`type`),
  CONSTRAINT `fk_events_owner` FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 14. ACTIVITIES
-- Historique d'activités du CRM (audit / timeline)
-- =====================================================================
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED NOT NULL,
  `entity`      VARCHAR(50)  NOT NULL,
  `entity_id`   BIGINT UNSIGNED NULL,
  `action`      VARCHAR(50)  NOT NULL,
  `description` TEXT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activities_user_id` (`user_id`),
  KEY `idx_activities_entity` (`entity`, `entity_id`),
  KEY `idx_activities_action` (`action`),
  KEY `idx_activities_created_at` (`created_at`),
  CONSTRAINT `fk_activities_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 15. NOTIFICATIONS
-- Notifications in-app
-- =====================================================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `title`      VARCHAR(190) NOT NULL,
  `message`    TEXT NOT NULL,
  `type`       VARCHAR(50)  NOT NULL DEFAULT 'info',
  `is_read`    BOOLEAN      NOT NULL DEFAULT FALSE,
  `read_at`    DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_is_read` (`is_read`),
  KEY `idx_notifications_type` (`type`),
  KEY `idx_notifications_created_at` (`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 16. SETTINGS
-- Paramètres utilisateur (un enregistrement par utilisateur)
-- =====================================================================
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id`                     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`                INT UNSIGNED NOT NULL,
  `theme`                  ENUM('light','dark','system') NOT NULL DEFAULT 'system',
  `language`               VARCHAR(10)  NOT NULL DEFAULT 'en',
  `timezone`               VARCHAR(50)  NOT NULL DEFAULT 'UTC',
  `notifications_enabled`  BOOLEAN      NOT NULL DEFAULT TRUE,
  `created_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_user_id` (`user_id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 17. AI_CONVERSATIONS
-- Conversations avec l'assistant IA (soft delete)
-- =====================================================================
DROP TABLE IF EXISTS `ai_conversations`;
CREATE TABLE `ai_conversations` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `title`      VARCHAR(190) NULL,
  `context`    TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ai_conversations_user_id` (`user_id`),
  KEY `idx_ai_conversations_created_at` (`created_at`),
  CONSTRAINT `fk_ai_conversations_user` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 18. AI_MESSAGES
-- Messages d'une conversation IA
-- =====================================================================
DROP TABLE IF EXISTS `ai_messages`;
CREATE TABLE `ai_messages` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED NOT NULL,
  `role`            ENUM('user','assistant') NOT NULL DEFAULT 'user',
  `content`         TEXT NOT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ai_messages_conversation_id` (`conversation_id`),
  KEY `idx_ai_messages_created_at` (`created_at`),
  CONSTRAINT `fk_ai_messages_conversation` FOREIGN KEY (`conversation_id`)
    REFERENCES `ai_conversations` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- FIN DU SCHÉMA — 18 tables créées
-- =====================================================================

