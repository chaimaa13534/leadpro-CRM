/* ═════════════════════════════════════════════════════════════════════
   Settings — Password Utilities
   ═════════════════════════════════════════════════════════════════════
   Utilitaires d’affichage pour l’indicateur de robustesse. Aucun
   mot de passe n’est stocké ni transmis : tout reste côté client et
   purement simulé.
   ═════════════════════════════════════════════════════════════════════ */

export type PasswordStrengthLabel = 'Très faible' | 'Faible' | 'Moyen' | 'Fort' | 'Excellent';

export interface PasswordStrength {
  score: number; // 0..5
  label: PasswordStrengthLabel;
  percentage: number; // 0..100
  variant: 'danger' | 'warning' | 'info' | 'success';
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const REQUIREMENT_LABELS: { key: keyof PasswordStrength['requirements']; label: string }[] = [
  { key: 'length', label: '8 caractères minimum' },
  { key: 'uppercase', label: 'Une majuscule' },
  { key: 'lowercase', label: 'Une minuscule' },
  { key: 'number', label: 'Un chiffre' },
  { key: 'special', label: 'Un caractère spécial' },
];

/** Calcule la robustesse d’un mot de passe (purement indicateur). */
export function computePasswordStrength(value: string): PasswordStrength {
  const requirements = {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let label: PasswordStrengthLabel = 'Très faible';
  if (score <= 1) label = 'Très faible';
  else if (score === 2) label = 'Faible';
  else if (score === 3) label = 'Moyen';
  else if (score === 4) label = 'Fort';
  else label = 'Excellent';

  let variant: PasswordStrength['variant'] = 'danger';
  if (score <= 2) variant = 'danger';
  else if (score === 3) variant = 'warning';
  else if (score === 4) variant = 'info';
  else variant = 'success';

  return {
    score,
    label,
    percentage: (score / 5) * 100,
    variant,
    requirements,
  };
}

export { REQUIREMENT_LABELS };

