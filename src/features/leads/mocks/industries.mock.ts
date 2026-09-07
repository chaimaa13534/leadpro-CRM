/**
 * Secteurs d'activité proposés dans le formulaire de création de lead.
 * Une liste de référence (pas un type strict) : contrairement au statut
 * ou à la priorité, le secteur n'a pas de logique métier attachée
 * (couleur, workflow…), donc une simple liste de chaînes suffit —
 * cohérent avec l'emplacement `features/leads/mocks/` plutôt que
 * `lib/constants/` (réservé aux vocabulaires du domaine).
 */
export const industriesMock: string[] = [
  'Technologie & Logiciels',
  'Textile & Habillement',
  'Agroalimentaire',
  'BTP & Construction',
  'Santé & Pharmacie',
  'Finance & Assurance',
  'Logistique & Transport',
  'Tourisme & Hôtellerie',
  'Énergie',
  'Industrie manufacturière',
  'Commerce de détail',
  'Conseil & Services professionnels',
  'Éducation',
  'Immobilier',
  'Médias & Communication',
  'Autre',
];
