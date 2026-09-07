import type {
  Lead,
  LeadPriority,
  LeadSource,
  LeadStatus,
} from '@/types/lead.types';
import { daysAgo } from '@/mocks/mock-date-helpers';

/**
 * Jeu de données factice pour les leads — ~40 entrées réalistes générées
 * de façon déterministe (mêmes données à chaque rechargement, pratique
 * pour développer et faire des captures d'écran stables) plutôt que
 * tirées au hasard.
 */

const FIRST_NAMES = [
  'Nour',
  'Yassine',
  'Sara',
  'Omar',
  'Rania',
  'Mehdi',
  'Salma',
  'Anas',
  'Hajar',
  'Karim',
  'Imane',
  'Reda',
  'Zineb',
  'Ayoub',
  'Lamia',
  'Souhail',
  'Ghita',
  'Bilal',
  'Meryem',
  'Adam',
];

const LAST_NAMES = [
  'El Amrani',
  'Bennani',
  'Idrissi',
  'Chraibi',
  'Fassi',
  'Ouazzani',
  'Tazi',
  'Benjelloun',
  'Alaoui',
  'Squalli',
  'Berrada',
  'Cherkaoui',
  'Lahlou',
  'Sbai',
  'Rachidi',
  'Amrani',
  'Ziani',
  'Kadiri',
  'Guessous',
  'Alami',
];

const COMPANIES = [
  'Atlas Textile',
  'Nour Cosmétiques',
  'Groupe Kawtar',
  'Sanad Pharma',
  'Fassi Consulting',
  'Ouazzani BTP',
  'Salma Textile',
  'Atlas Logistique',
  'Meditel Solutions',
  'Casa Digital',
  'Rif Agro',
  'Sahara Energie',
  'Marrakech Hospitality',
  'Tanger Import Export',
  'Fès Artisanat',
  'Agadir Fresh',
  'Oujda Industries',
  'Kenitra Automotive',
  'Rabat Finance',
  'Settat Manufacturing',
];

const JOB_TITLES = [
  'Directeur Général',
  'Responsable Achats',
  'Directeur Marketing',
  'Responsable IT',
  'Directeur Commercial',
  'Responsable RH',
  "Chargé d'affaires",
  'Directeur Financier',
];

const STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'converted',
];

const SOURCES: LeadSource[] = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email_campaign',
  'event',
  'other',
];

const OWNER_IDS = ['user-1', 'user-2', 'user-3', 'user-4'];

const PRIORITIES: LeadPriority[] = ['low', 'medium', 'high'];

const LEAD_COUNT = 40;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const leadsMock: Lead[] = Array.from(
  { length: LEAD_COUNT },
  (_, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length]!;
    const lastNameIndex =
      (index * 3 + 1 + Math.floor(index / 20) * 11) % LAST_NAMES.length;
    const lastName = LAST_NAMES[lastNameIndex]!;
    const companyName = COMPANIES[(index * 5 + 2) % COMPANIES.length]!;
    const jobTitle = JOB_TITLES[index % JOB_TITLES.length]!;
    const status = STATUSES[index % STATUSES.length]!;
    const source = SOURCES[(index * 2 + 1) % SOURCES.length]!;
    const ownerId = OWNER_IDS[index % OWNER_IDS.length]!;
    const priority = PRIORITIES[(index * 7 + 3) % PRIORITIES.length]!;
    const createdDaysAgo = (index * 7) % 180;
    const score = 30 + ((index * 13) % 70);
    const estimatedValue = 15000 + ((index * 8500) % 250000);

    return {
      id: `lead-${index + 1}`,
      firstName,
      lastName,
      email: `${slugify(firstName)}.${slugify(lastName)}@${slugify(companyName)}.ma`,
      phone: `+212 6${(10000000 + index * 137).toString().slice(0, 8)}`,
      companyName,
      jobTitle,
      status,
      source,
      priority,
      score,
      estimatedValue,
      ownerId,
      createdAt: daysAgo(createdDaysAgo),
      updatedAt: daysAgo(Math.max(0, createdDaysAgo - 2)),
      lastActivityAt: daysAgo(
        Math.max(0, createdDaysAgo - ((index * 3) % createdDaysAgo || 1)),
      ),
    };
  },
);
