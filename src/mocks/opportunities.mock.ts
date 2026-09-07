import type { Opportunity } from '@/types/opportunity.types';

const NOW = new Date();
const daysAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 86400000).toISOString();
const daysFromNow = (n: number): string =>
  new Date(NOW.getTime() + n * 86400000).toISOString();
const monthsAgo = (n: number): string =>
  new Date(NOW.getTime() - n * 30 * 86400000).toISOString();

const OPPORTUNITY_NAMES: string[] = [
  'Déploiement CRM Atlassian',
  'Prestation Conseil SI',
  'Licences Microsoft 365',
  'Infrastructure Cloud AWS',
  'Solution Data Warehouse',
  'Audit Sécurité Réseau',
  'Développement App Mobile',
  'ERP Oracle Migration',
  'Service Desk Managé',
  'Transformation Digitale',
  'Logiciel RH SIRH',
  'Plateforme E-commerce',
  'Solution BI Power BI',
  'Cybersécurité SOC',
  'VPN Multi Sites',
  'Intranet Collaboratif',
  'Formation DevOps',
  'Vente Serveurs Dell',
  'Firewall Fortinet',
  'Backup & Recovery Veeam',
  'Virtualisation VMware',
  'Câblage Structuré',
  'Solution VoIP Cisco',
  'Contrôle d\'Accès',
  'Vidéosurveillance IP',
  'Site Web Responsive',
  'SEO & SEA Global',
  'Marketing Automation',
  'Chatbot IA Service Client',
  'Application SaaS Métier',
  'Base de données NoSQL',
  'Réseau Privé MPLS',
  'Hébergement Cloud Privé',
  'Solution GED DocuShare',
  'Signature Électronique',
  'Workflow Approbation',
  'Gestion Parc Informatique',
  'Asset Management IT',
  'Disaster Recovery Plan',
  'Téléphonie IP Omnichannel',
  'CRM Salesforce Migration',
  'Portail Collaboratif',
  'Solution GPAO Maintenance',
  'Gestion de Flotte',
  'Transport & Logistique TMS',
  'WMS Entrepôt Connecté',
  'IoT Industrie 4.0',
  'Jumeau Numérique',
  'RPA Automatisation',
  'IA Prédictive',
];

const COMPANIES: { id: string; name: string }[] = [
  { id: 'company-1', name: 'Atlas Textile' },
  { id: 'company-2', name: 'Maroc Telecom' },
  { id: 'company-3', name: 'OCP Group' },
  { id: 'company-4', name: 'Attijariwafa Bank' },
  { id: 'company-5', name: 'Royal Air Maroc' },
  { id: 'company-6', name: 'Managem' },
  { id: 'company-7', name: 'Cosumar' },
  { id: 'company-8', name: 'LafargeHolcim Maroc' },
  { id: 'company-9', name: 'Lesieur Cristal' },
  { id: 'company-10', name: 'Chaabi Pharm' },
  { id: 'company-11', name: 'Wafa Assurance' },
  { id: 'company-12', name: 'BMCE Bank' },
  { id: 'company-13', name: 'Lydec' },
  { id: 'company-14', name: 'ONEE' },
  { id: 'company-15', name: 'Yazaki Maroc' },
  { id: 'company-16', name: 'Siemens Maroc' },
  { id: 'company-17', name: 'Renault Maroc' },
  { id: 'company-18', name: 'BIM Maroc' },
  { id: 'company-19', name: 'LabelVie' },
  { id: 'company-20', name: 'Marsa Maroc' },
  { id: 'company-21', name: 'Saham Assurance' },
  { id: 'company-22', name: 'Marjane Holding' },
  { id: 'company-23', name: 'Akwa Group' },
  { id: 'company-24', name: 'Holmarcom' },
  { id: 'company-25', name: 'SNEP' },
  { id: 'company-26', name: 'Nareva' },
  { id: 'company-27', name: 'Aluminium du Maroc' },
  { id: 'company-28', name: 'Brasseries du Maroc' },
  { id: 'company-29', name: 'CTM' },
  { id: 'company-30', name: 'IAM' },
];

const CONTACTS: { id: string; name: string }[] = [
  { id: 'contact-1', name: 'Nour Bennani' },
  { id: 'contact-2', name: 'Yassine Idrissi' },
  { id: 'contact-3', name: 'Sara El Fassi' },
  { id: 'contact-4', name: 'Omar El Amrani' },
  { id: 'contact-5', name: 'Imane Zniber' },
  { id: 'contact-6', name: 'Mehdi Cherkaoui' },
  { id: 'contact-7', name: 'Hind Bencheikh' },
  { id: 'contact-8', name: 'Amine Alaoui' },
  { id: 'contact-9', name: 'Salma El Mouden' },
  { id: 'contact-10', name: 'Karim Tazi' },
  { id: 'contact-11', name: 'Leila Kabiri' },
  { id: 'contact-12', name: 'Hicham Sebti' },
  { id: 'contact-13', name: 'Mounia Ouazzani' },
  { id: 'contact-14', name: 'Anas Berrada' },
  { id: 'contact-15', name: 'Fatima Hamidi' },
  { id: 'contact-16', name: 'Rachid Lahlou' },
  { id: 'contact-17', name: 'Samira Fikri' },
  { id: 'contact-18', name: 'Adil Naciri' },
  { id: 'contact-19', name: 'Khadija Boukhriss' },
  { id: 'contact-20', name: 'Driss Bennis' },
  { id: 'contact-21', name: 'Nadia Guedira' },
  { id: 'contact-22', name: 'Hassan El Haddad' },
  { id: 'contact-23', name: 'Soukaina Moutaouakil' },
  { id: 'contact-24', name: 'Youssef Jerroudi' },
  { id: 'contact-25', name: 'Meryem Bahraoui' },
  { id: 'contact-26', name: 'Kamal Safri' },
  { id: 'contact-27', name: 'Amina Kandoussi' },
  { id: 'contact-28', name: 'Ali Rhanem' },
  { id: 'contact-29', name: 'Hajar Kabbaj' },
  { id: 'contact-30', name: 'Tarik Msaadi' },
];

const OWNERS = [
  { id: 'user-1', name: 'Alex Martin' },
  { id: 'user-2', name: 'Sara Idrissi' },
  { id: 'user-3', name: 'Yassine Bennani' },
  { id: 'user-4', name: 'Omar Chraibi' },
];

const PIPELINES = ['Sales Pipeline', 'Enterprise Pipeline', 'Partner Pipeline'];
const STAGES = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const;
const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
const STATUSES = ['active', 'on_hold', 'won', 'lost', 'abandoned'] as const;
const CURRENCIES = ['MAD', 'EUR', 'USD'] as const;
const SOURCES = ['inbound', 'outbound', 'referral', 'website', 'social_media', 'event', 'cold_call', 'email_campaign', 'partner', 'existing_customer', 'other'] as const;

const TAGS_POOL: string[] = [
  'Urgent', 'Stratégique', 'Nouveau', 'Froid', 'Chaud', 'Prioritaire',
  'Négociation', 'Prospection', 'Récurrent', 'Haute Valeur', 'Pilot',
  'Signé', 'En attente', 'Relance', 'Gros Compte',
];

const NOTES_POOL: string[] = [
  'Projet stratégique pour le groupe. Budget validé en comité.',
  'Contact très intéressé par notre solution. À suivre de près.',
  'Négociation en cours sur les conditions tarifaires.',
  'Démonstration effectuée. En attente du retour du comité technique.',
  'Concurrent identifié : solution concurrente moins chère.',
  'Client fidèle. Renouvellement de contrat annuel.',
  'Premier rendez-vous très prometteur. Prochaine étape : POC.',
  'Budget alloué. Décision attendue pour la fin du trimestre.',
  'Projet mis en pause suite à la restructuration interne.',
  'Opportunité générée via le salon IT de Casablanca.',
  'Demande de devis détaillé envoyée au client.',
  'Appel de qualification effectué. Contact décideur atteint.',
  'Proposition commerciale remise en main propre.',
  'Relance effectuée - en attente de retour client.',
  'Signature imminente. Contrat en cours de validation juridique.',
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomN(arr: readonly string[], min: number, max: number): string[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const opportunitiesMock: Opportunity[] = OPPORTUNITY_NAMES.map((name, index) => {
  const company = COMPANIES[index % COMPANIES.length]!;
  const contact = CONTACTS[index % CONTACTS.length]!;
  const owner = OWNERS[index % OWNERS.length]!;
  const stage = STAGES[index % STAGES.length]!;
  const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)]!;
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]!;
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)]!;
  const pipeline = PIPELINES[Math.floor(Math.random() * PIPELINES.length)]!;
  const probability = stage === 'closed_won' ? 100 : stage === 'closed_lost' ? 0 : Math.floor(Math.random() * 80) + 10;
  const amount = [25000, 50000, 75000, 100000, 150000, 200000, 350000, 500000, 750000, 1000000][Math.floor(Math.random() * 10)]!;
  const createdAt = monthsAgo(Math.floor(Math.random() * 12));
  const lastActivityAt = Math.random() > 0.2 ? daysAgo(Math.floor(Math.random() * 30)) : undefined;
  const expectedCloseDate = Math.random() > 0.3 ? daysFromNow(Math.floor(Math.random() * 180)) : undefined;

  let status: typeof STATUSES[number];
  if (stage === 'closed_won') status = 'won';
  else if (stage === 'closed_lost') status = 'lost';
  else if (Math.random() > 0.9) status = 'on_hold';
  else status = 'active';

  return {
    id: `opportunity-${index + 1}`,
    name,
    companyId: company.id,
    companyName: company.name,
    contactId: contact.id,
    contactName: contact.name,
    ownerId: owner.id,
    amount,
    currency,
    probability,
    pipeline,
    stage,
    priority,
    status,
    source,
    expectedCloseDate,
    lastActivityAt,
    createdAt,
    updatedAt: lastActivityAt ?? createdAt,
    description: `Opportunité stratégique pour ${company.name} — ${name}. Contact principal : ${contact.name}.`,
    notes: Math.random() > 0.3 ? pickRandom(NOTES_POOL) : undefined,
    tags: pickRandomN(TAGS_POOL, 1, 4),
    history: [],
    documents: [],
    activities: [],
  };
});

