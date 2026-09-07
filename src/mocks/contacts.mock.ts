import type { Contact, ContactStatus } from '@/types/contact.types';

const NOW = new Date();
const daysAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 86400000).toISOString();
const monthsAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 30 * 86400000).toISOString();

const STATUSES: ContactStatus[] = ['active', 'active', 'active', 'active', 'inactive', 'vip'];

const FIRST_NAMES: string[] = [
  'Nour', 'Yassine', 'Sara', 'Omar', 'Imane', 'Mehdi', 'Hind', 'Amine',
  'Salma', 'Karim', 'Leila', 'Hicham', 'Mounia', 'Anas', 'Fatima', 'Rachid',
  'Samira', 'Adil', 'Khadija', 'Driss', 'Nadia', 'Hassan', 'Soukaina', 'Youssef',
  'Meryem', 'Kamal', 'Amina', 'Ali', 'Hajar', 'Tarik', 'Lamiae', 'Zakaria',
  'Ghita', 'Walid', 'Nawal', 'Reda', 'Latifa', 'Ayoub', 'Asmae', 'Saad',
  'Sanae', 'Imad', 'Dounia', 'Othmane', 'Manal', 'Khalid', 'Rania', 'Fouad',
  'Kenza', 'Badr', 'Loubna', 'Abdellah', 'Yasmine', 'Sami',
];

const LAST_NAMES: string[] = [
  'Bennani', 'Idrissi', 'El Fassi', 'El Amrani', 'Zniber', 'Cherkaoui',
  'Bencheikh', 'Alaoui', 'El Mouden', 'Tazi', 'Kabiri', 'Sebti', 'Ouazzani',
  'Berrada', 'Hamidi', 'Lahlou', 'Fikri', 'Naciri', 'Boukhriss', 'Bennis',
  'Guedira', 'El Haddad', 'Moutaouakil', 'Jerroudi', 'Bahraoui', 'Safri',
  'Kandoussi', 'Rhanem', 'Kabbaj', 'Msaadi', 'Ouhssaine', 'El Yamani',
];

const COMPANIES: string[] = [
  'Atlas Textile', 'Maroc Telecom', 'OCP Group', 'Attijariwafa Bank',
  'Royal Air Maroc', 'Managem', 'Cosumar', 'LafargeHolcim Maroc',
  'Lesieur Cristal', 'Chaabi Pharm', 'Wafa Assurance', 'BMCE Bank',
  'Lydec', 'ONEE', 'RAM Distribution', 'Yazaki Maroc', 'Lear Corporation',
  'Siemens Maroc', 'Renault Maroc', 'Stellantis Maroc', 'BIM Maroc',
  'LabelVie', 'Aradei Capital', 'Marsa Maroc', 'Mutandis', 'Saham Assurance',
  'Marjane Holding', 'Akwa Group', 'Holmarcom', 'SNEP',
];

const JOB_TITLES: string[] = [
  'Directeur Général', 'Directeur Commercial', 'Directeur Marketing',
  'Responsable des Ventes', 'Chef de Produit', 'Business Developer',
  'Account Manager', 'CEO', 'CTO', 'CFO', 'VP Sales', 'VP Marketing',
  'Directeur des Opérations', 'Responsable Achats', 'Responsable RH',
  'Consultant Senior', 'Ingénieur Commercial', 'Responsable Partenariats',
  'Head of Growth', 'Directeur Technique', 'Digital Manager',
  'Brand Manager', 'Sales Manager', 'Marketing Manager',
];

const CITIES: string[] = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida',
  'Béni Mellal', 'Nador', 'Taza', 'Mohammedia', 'Laâyoune',
  'Dakhla', 'Ouarzazate', 'Settat', 'Khouribga', 'Essaouira',
];

const COUNTRIES: string[] = [
  'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc', 'Maroc',
  'France', 'France', 'Belgique', 'Canada', 'Tunisie', 'Sénégal',
  "Côte d'Ivoire", 'Émirats Arabes Unis', 'Arabie Saoudite',
];

const TAGS_POOL: string[] = [
  'VIP', 'Froid', 'Chaud', 'Prêt', 'Négociation', 'Prospection',
  'Partenaire', 'Concurrent', 'Récurrent', 'Nouveau',
  'À relancer', 'Qualifié', 'Lead chaud', 'Décideur',
];

const NOTES_POOL: string[] = [
  'Contact stratégique pour le développement de la région.',
  'Excellent relationnel, très réceptif à notre offre.',
  'À recontacter après le comité de direction.',
  'Client fidèle depuis plusieurs années.',
  'Demande une démonstration produit.',
  'Présenté lors du salon international de Casablanca.',
  'Contact froid, à retravailler avec une nouvelle approche.',
  'A recommandé nos services à deux autres prospects.',
  'En attente de signature du contrat.',
  'Premier contact très prometteur.',
  'A participé au webinar de lancement.',
  'Demande un rendez-vous physique.',
  'À suivre de près, gros potentiel.',
  'Négociation en cours sur le contrat cadre.',
  'Réunion programmée pour la semaine prochaine.',
  'Profil LinkedIn très actif dans le secteur.',
  'Contact qualifié par l\'équipe marketing.',
  'Relance effectuée - en attente de retour.',
  'Dossier prioritaire pour ce trimestre.',
  'Contact LinkedIn mutuel avec Sara Idrissi.',
];

const STREETS: string[] = [
  'Boulevard Mohammed V',
  'Avenue Hassan II',
  'Rue Oued El Makhazine',
  'Boulevard Zerktouni',
  'Avenue des FAR',
  'Rue Ibn Sina',
];

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomN(arr: string[], min: number, max: number): string[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generatePhone(): string {
  const prefix = Math.random() > 0.5 ? '06' : '07';
  const digits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return `+212 ${prefix} ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)}`;
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domain = company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}.ma`;
}

export const contactsMock: Contact[] = FIRST_NAMES.map((firstName, index) => {
  const lastName = LAST_NAMES[index % LAST_NAMES.length]!;
  const company = COMPANIES[index % COMPANIES.length]!;
  const createdAt = monthsAgo(Math.floor(Math.random() * 12));
  const lastActivityAt = Math.random() > 0.3 ? daysAgo(Math.floor(Math.random() * 60)) : undefined;
  const city = pickRandom(CITIES);
  const country = pickRandom(COUNTRIES);

  return {
    id: `contact-${index + 1}`,
    firstName,
    lastName,
    email: generateEmail(firstName, lastName, company),
    phone: Math.random() > 0.15 ? generatePhone() : undefined,
    mobile: Math.random() > 0.4 ? generatePhone() : undefined,
    jobTitle: pickRandom(JOB_TITLES),
    company,
    companyId: `company-${(index % 30) + 1}`,
    avatarUrl: undefined,
    ownerId: `user-${(index % 4) + 1}`,
    notes: Math.random() > 0.3 ? pickRandom(NOTES_POOL) : undefined,
    tags: pickRandomN(TAGS_POOL, 1, 3),
    linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    website: `https://${company.toLowerCase().replace(/\s+/g, '')}.ma`,
    address: `${Math.floor(Math.random() * 400) + 1} ${pickRandom(STREETS)}`,
    city,
    country,
    status: STATUSES[index % STATUSES.length]!,
    createdAt,
    updatedAt: lastActivityAt ?? createdAt,
    lastActivityAt,
  };
});

