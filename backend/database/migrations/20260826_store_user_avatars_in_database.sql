-- Ex?cuter une seule fois sur une base LeadPro existante.
-- Les anciennes URL d'avatar restent lisibles ; les prochains t?l?versements
-- seront enregistr?s directement dans users.avatar sous forme de data URL.
ALTER TABLE `users`
  MODIFY COLUMN `avatar` MEDIUMTEXT NULL;
