import type { CompanySize } from '@/types/company.types';

/**
 * Tailles d'entreprise labellisées. Vit dans `lib/constants/` (pas dans
 * `features/leads/`) parce que `CompanySize` est un type du domaine
 * Company (`types/company.types.ts`), pas spécifique aux leads — le
 * futur module Companies (Semaine 2) réutilisera cette même liste.
 */
export const COMPANY_SIZES: Record<CompanySize, { label: string }> = {
  '1-10': { label: '1 à 10 employés' },
  '11-50': { label: '11 à 50 employés' },
  '51-200': { label: '51 à 200 employés' },
  '201-500': { label: '201 à 500 employés' },
  '501-1000': { label: '501 à 1000 employés' },
  '1000+': { label: 'Plus de 1000 employés' },
};

export const COMPANY_SIZE_OPTIONS: CompanySize[] = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];
