import type { Company, CompanyStatus, CompanySource } from '@/types/company.types';

const NOW = new Date();
const daysAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 86400000).toISOString();
const monthsAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 30 * 86400000).toISOString();

const STATUSES: CompanyStatus[] = ['active', 'active', 'active', 'inactive', 'active', 'lead'];

const SOURCES: CompanySource[] = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email_campaign',
  'event',
  'partner',
  'other',
];

const COMPANY_NAMES: string[] = [
  'Atlas Textile', 'Maroc Telecom', 'OCP Group', 'Attijariwafa Bank',
  'Royal Air Maroc', 'Managem', 'Cosumar', 'LafargeHolcim Maroc',
  'Lesieur Cristal', 'Wafa Assurance', 'BMCE Bank',
  'Lydec', 'ONEE', 'RAM Distribution', 'Yazaki Maroc',
  'Siemens Maroc', 'Renault Maroc', 'BIM Maroc',
  'LabelVie', 'Aradei Capital', 'Marsa Maroc', 'Mutandis',
  'Saham Assurance', 'Marjane Holding', 'Akwa Group',
  'Holmarcom', 'SNEP', 'Nareva', 'M2M Group',
  'CFG Bank', 'HPS', 'Dislog Group', 'Chaabi Pharm',
  'Disty Technologie', 'Jorf Lasfar', 'Sonasid',
  'Fenie Brossette', 'Ciments du Maroc', 'Orange Maroc',
  'Inwi',
];

const INDUSTRIES: string[] = [
  'Textile', 'Télécommunications', 'Industrie chimique', 'Banque / Finance',
  'Transport aérien', 'Mines et métaux', 'Agroalimentaire', 'Matériaux de construction',
  'Assurances', 'Énergie et eau', 'Distribution', 'Automobile',
  'Grande distribution', 'Immobilier', 'Logistique portuaire',
  'Holding', 'Énergies renouvelables', 'Technologies', 'Pharmaceutique',
  'Digital / IT', 'BTP',
];

const CITIES: string[] = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida',
  'Béni Mellal', 'Nador', 'Mohammedia', 'Laâyoune',
  'Dakhla', 'Ouarzazate', 'Settat', 'Khouribga',
];

const COUNTRIES: string[] = [
  'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc',
  'France', 'France', 'Belgique', 'Canada', 'Tunisie', 'Sénégal',
  "Côte d'Ivoire", 'Émirats Arabes Unis',
];

const TAGS_POOL: string[] = [
  'Stratégique', 'Partenaire', 'VIP', 'Récurrent', 'Nouveau',
  'À relancer', 'Grand compte', 'PME', 'Startup', 'International',
  'Local', 'Croissance', 'Prioritaire', 'Dormant', 'Concurrent',
];

const NOTES_POOL: string[] = [
  'Compte stratégique pour le développement régional.',
  'Excellent partenariat, renouvellement annuel en cours.',
  'Client fidèle depuis plusieurs années, plusieurs contrats signés.',
  'Nouveau prospect, démarchage en cours.',
  'Relation commerciale solide, interlocuteurs réactifs.',
  'À développer sur le segment B2B.',
  'Compte prioritaire pour le trimestre en cours.',
  'Négociation en cours sur un contrat cadre pluriannuel.',
  'Contact établi lors du salon CRM de Casablanca.',
  'Demande une solution personnalisée pour leur équipe commerciale.',
  'Problème de paiement signalé, à suivre de près.',
  'Référence dans le secteur, pourrait ouvrir d\'autres portes.',
  'Contrat signé pour un accompagnement sur 12 mois.',
  'Prospection en phase avancée, démo programmée.',
  'Client satisfait, a recommandé nos services à 2 prospects.',
];

const STREETS: string[] = [
  "Boulevard Mohammed V",
  "Avenue Hassan II",
  "Rue Oued El Makhazine",
  "Boulevard Zerktouni",
  "Avenue des FAR",
  "Angle Bd Moulay Youssef",
  "Rue Ibn Sina",
  "Avenue Annakhil",
  "Quartier des Hôpitaux",
  "Zone Industrielle Sidi Ghanem",
];

const DOMAINS: Record<string, string> = {
  'Atlas Textile': 'atlastextile',
  'Maroc Telecom': 'iam',
  'OCP Group': 'ocpgroup',
  'Attijariwafa Bank': 'attijariwafa',
  'Royal Air Maroc': 'royalairmaroc',
  Managem: 'managem',
  Cosumar: 'cosumar',
  'LafargeHolcim Maroc': 'lafargeholcim',
  'Lesieur Cristal': 'lesieur',
  'Wafa Assurance': 'wafaassurance',
  'BMCE Bank': 'bmcebank',
  Lydec: 'lydec',
  ONEE: 'onee',
  'RAM Distribution': 'ramdistribution',
  'Yazaki Maroc': 'yazaki',
  'Siemens Maroc': 'siemens',
  'Renault Maroc': 'renault',
  'BIM Maroc': 'bim',
  LabelVie: 'labelvie',
  'Aradei Capital': 'aradei',
  'Marsa Maroc': 'marsamaroc',
  Mutandis: 'mutandis',
  'Saham Assurance': 'saham',
  'Marjane Holding': 'marjane',
  'Akwa Group': 'akwa',
  Holmarcom: 'holmarcom',
  SNEP: 'snep',
  Nareva: 'nareva',
  'M2M Group': 'm2mgroup',
  'CFG Bank': 'cfgbank',
  HPS: 'hps',
  'Dislog Group': 'dislog',
  'Chaabi Pharm': 'chaabipharm',
  'Disty Technologie': 'disty',
  'Jorf Lasfar': 'jorflasfar',
  Sonasid: 'sonasid',
  'Fenie Brossette': 'feniebrossette',
  'Ciments du Maroc': 'cimentsdumaroc',
  'Orange Maroc': 'orange',
  Inwi: 'inwi',
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomN(arr: string[], min: number, max: number): string[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone(): string {
  const prefix = Math.random() > 0.3 ? '05' : '06';
  const digits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return `+212 ${prefix} ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`;
}

function generateEmail(name: string): string {
  const domain = DOMAINS[name] ?? name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `contact@${domain}.ma`;
}

function generateWebsite(name: string): string {
  const domain = DOMAINS[name] ?? name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `https://www.${domain}.ma`;
}

function generateLogoUrl(name: string): string {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return `https://placehold.co/80x80/2563eb/ffffff?text=${initials}`;
}

function generateDescription(name: string, industry: string): string {
  const descs: Record<string, string[]> = {
    'Textile': [
      `Leader marocain dans le secteur textile, ${name} exporte vers plus de 30 pays.`,
      `Fabricant de textiles techniques et de vêtements professionnels depuis plus de 20 ans.`,
      `Spécialiste de la confection haut de gamme pour les grandes marques européennes.`,
    ],
    'Télécommunications': [
      `${name} est l'un des principaux opérateurs de télécommunications au Maroc, proposant des services mobiles, fixes et Internet.`,
      `Opérateur télécom innovant avec une couverture nationale de premier plan.`,
    ],
    'Banque / Finance': [
      `${name} est une institution financière de référence au Maroc, présente dans plus de 20 pays.`,
      `Banque universelle offrant une gamme complète de services financiers aux particuliers et aux entreprises.`,
    ],
    'Énergies renouvelables': [
      `${name} développe des projets d'énergies renouvelables (solaire, éolien) au Maroc et en Afrique.`,
      `Acteur majeur de la transition énergétique avec un portefeuille de centrales propres.`,
    ],
  };

  const key = Object.keys(descs).find((k) => industry.includes(k));
  if (key && descs[key]) {
    return pickRandom(descs[key]);
  }

  return `${name} est une entreprise de premier plan dans le secteur ${industry.toLowerCase()}, basée au Maroc.`;
}

export const companiesMock: Company[] = COMPANY_NAMES.map((name, index) => {
  const industry = INDUSTRIES[index % INDUSTRIES.length]!;
  const createdAt = monthsAgo(randomInt(1, 24));
  const lastActivityAt = Math.random() > 0.15 ? daysAgo(randomInt(1, 90)) : undefined;
  const city = pickRandom(CITIES);
  const country = pickRandom(COUNTRIES);
  const employeeCount = [randomInt(5, 50), randomInt(50, 200), randomInt(200, 1000), randomInt(1000, 5000)][index % 4]!;
  const estimatedRevenue = [100000, 500000, 2000000, 5000000, 10000000, 25000000, 50000000, 100000000, 250000000][index % 9]!;
  const contactCount = randomInt(1, 8);
  const leadCount = randomInt(0, 5);
  const oppCount = randomInt(0, 6);

  return {
    id: `company-${index + 1}`,
    name,
    industry,
    description: generateDescription(name, industry),
    email: generateEmail(name),
    phone: generatePhone(),
    website: generateWebsite(name),
    logoUrl: generateLogoUrl(name),
    address: `${randomInt(1, 500)} ${pickRandom(STREETS)}`,
    city,
    country,
    zipCode: `${randomInt(10000, 99999)}`,
    size: employeeCount <= 10 ? '1-10' : employeeCount <= 50 ? '11-50' : employeeCount <= 200 ? '51-200' : employeeCount <= 500 ? '201-500' : employeeCount <= 1000 ? '501-1000' : '1000+',
    vatNumber: `MA${String(index + 1).padStart(9, '0')}`,
    employeeCount,
    estimatedRevenue,
    ownerId: `user-${(index % 4) + 1}`,
    status: STATUSES[index % STATUSES.length]!,
    source: pickRandom(SOURCES),
    linkedContactIds: Array.from(
      { length: contactCount },
      (_, i) => `contact-${((index * 8) + i) % 51 + 1}`,
    ),
    linkedLeadIds: Array.from(
      { length: leadCount },
      (_, i) => `lead-${((index * 5) + i) % 61 + 1}`,
    ),
    linkedOpportunityIds: Array.from(
      { length: oppCount },
      (_, i) => `opportunity-${((index * 6) + i) % 41 + 1}`,
    ),
    tags: pickRandomN(TAGS_POOL, 1, 4),
    notes: Math.random() > 0.3 ? pickRandom(NOTES_POOL) : undefined,
    createdAt,
    updatedAt: lastActivityAt ?? createdAt,
    lastActivityAt,
  };
});

