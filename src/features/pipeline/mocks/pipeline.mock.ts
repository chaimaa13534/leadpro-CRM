/**
 * Données simulées pour le Pipeline Kanban.
 * 70+ opportunités réalistes réparties sur les 7 colonnes.
 */
import type { Opportunity, OpportunityActivity, OpportunityDocument, OpportunityHistoryEntry } from '@/types/opportunity.types';
import type { PipelineStage } from '@/types/opportunity.types';

const NOW = new Date();
const daysAgo = (n: number): string => new Date(NOW.getTime() - n * 86400000).toISOString();
const daysFromNow = (n: number): string => new Date(NOW.getTime() + n * 86400000).toISOString();

const COMPANIES = [
  { id: 'c1', name: 'Atlas Textile' }, { id: 'c2', name: 'Maroc Telecom' },
  { id: 'c3', name: 'OCP Group' }, { id: 'c4', name: 'Attijariwafa Bank' },
  { id: 'c5', name: 'Royal Air Maroc' }, { id: 'c6', name: 'Managem' },
  { id: 'c7', name: 'Cosumar' }, { id: 'c8', name: 'LafargeHolcim' },
  { id: 'c9', name: 'Lesieur Cristal' }, { id: 'c10', name: 'Wafa Assurance' },
  { id: 'c11', name: 'BMCE Bank' }, { id: 'c12', name: 'Lydec' },
  { id: 'c13', name: 'ONEE' }, { id: 'c14', name: 'Siemens Maroc' },
  { id: 'c15', name: 'Renault Maroc' }, { id: 'c16', name: 'LabelVie' },
  { id: 'c17', name: 'Marsa Maroc' }, { id: 'c18', name: 'Saham Assurance' },
  { id: 'c19', name: 'Marjane Holding' }, { id: 'c20', name: 'Akwa Group' },
];

const CONTACTS = [
  { id: 'ct1', name: 'Nour Bennani' }, { id: 'ct2', name: 'Yassine Idrissi' },
  { id: 'ct3', name: 'Sara El Fassi' }, { id: 'ct4', name: 'Omar El Amrani' },
  { id: 'ct5', name: 'Imane Zniber' }, { id: 'ct6', name: 'Mehdi Cherkaoui' },
  { id: 'ct7', name: 'Hind Bencheikh' }, { id: 'ct8', name: 'Amine Alaoui' },
  { id: 'ct9', name: 'Salma El Mouden' }, { id: 'ct10', name: 'Karim Tazi' },
  { id: 'ct11', name: 'Leila Kabiri' }, { id: 'ct12', name: 'Hicham Sebti' },
  { id: 'ct13', name: 'Mounia Ouazzani' }, { id: 'ct14', name: 'Anas Berrada' },
  { id: 'ct15', name: 'Fatima Hamidi' }, { id: 'ct16', name: 'Rachid Lahlou' },
  { id: 'ct17', name: 'Samira Fikri' }, { id: 'ct18', name: 'Adil Naciri' },
  { id: 'ct19', name: 'Khadija Boukhriss' }, { id: 'ct20', name: 'Driss Bennis' },
];

const OWNERS = [
  { id: 'user-1', name: 'Alex Martin' }, { id: 'user-2', name: 'Sara Idrissi' },
  { id: 'user-3', name: 'Yassine Bennani' }, { id: 'user-4', name: 'Omar Chraibi' },
];

const PIPELINES = ['Sales Pipeline', 'Enterprise Pipeline', 'Partner Pipeline'];

const STAGES: PipelineStage[] = [
  'prospecting', 'qualification', 'proposal', 'negotiation', 'contract_sent', 'closed_won', 'closed_lost',
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
const CURRENCIES = ['MAD', 'EUR', 'USD'] as const;
const SOURCES = ['inbound', 'outbound', 'referral', 'website', 'social_media', 'event', 'cold_call', 'email_campaign', 'partner', 'existing_customer', 'other'] as const;

const TAGS_POOL = [
  'Urgent', 'Stratégique', 'Nouveau', 'Chaud', 'Prioritaire',
  'Négociation', 'Prospection', 'Récurrent', 'Haute Valeur', 'Pilot',
  'Signé', 'En attente', 'Relance', 'Gros Compte', 'VIP', 'International',
];

const OPPORTUNITY_NAMES = [
  'Déploiement CRM Salesforce', 'Migration Cloud AWS', 'Audit Sécurité Réseau',
  'Solution Data Warehouse', 'ERP Oracle Migration', 'Transformation Digitale',
  'Plateforme E-commerce B2B', 'Solution BI Power BI', 'Cybersécurité SOC',
  'VPN Multi Sites', 'Intranet Collaboratif', 'Formation DevOps',
  'Infrastructure Serveurs Dell', 'Firewall Fortinet Enterprise', 'Backup Veeam',
  'Virtualisation VMware', 'Solution VoIP Cisco', 'Contrôle d\'Accès Biométrique',
  'Vidéosurveillance IP', 'Site Web Responsive', 'Marketing Automation HubSpot',
  'Chatbot IA Service Client', 'Application SaaS Métier', 'Base de données NoSQL',
  'Réseau Privé MPLS', 'Hébergement Cloud Privé', 'Solution GED DocuShare',
  'Signature Électronique', 'Workflow Approbation', 'Gestion Parc Informatique',
  'Asset Management IT', 'Disaster Recovery Plan', 'CRM Salesforce Migration',
  'Portail Collaboratif', 'Solution GPAO Maintenance', 'Gestion de Flotte',
  'Transport & Logistique TMS', 'WMS Entrepôt Connecté', 'IoT Industrie 4.0',
  'Jumeau Numérique', 'RPA Automatisation', 'IA Prédictive',
  'Service Desk Managé', 'Licences Microsoft 365', 'Prestation Conseil SI',
  'Câblage Structuré', 'Solution RH SIRH', 'SEO & SEA Global',
  'Application Mobile', 'Téléphonie IP Omnichannel', 'Solution GPAO',
  'Gestion Énergétique', 'Data Analytics Platform', 'Cloud Hybride',
  'Solution Anti-DDoS', 'WAF & CDN', 'MDM Mobile Device Management',
  'SOC Managé 24/7', 'Pentest Annuel', 'PKI Infrastructure',
  'Blockchain Supply Chain', 'Edge Computing', 'SD-WAN Enterprise',
  'Load Balancing F5', 'Containerisation Kubernetes', 'Serverless Architecture',
  'API Management Platform', 'Data Lake Hadoop', 'Solution CRM Sur-Mesure',
  'ESB Enterprise Service Bus', 'Solution e-Learning', 'Portail RH Self-Service',
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomN(arr: readonly string[], min: number, max: number): string[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function generateActivities(count: number): OpportunityActivity[] {
  const types: OpportunityActivity['type'][] = ['note', 'call', 'email', 'meeting', 'task', 'status_change'];
  const titles = [
    'Appel de qualification', 'Email de relance', 'Réunion de démonstration',
    'Note interne', 'Proposition envoyée', 'Devis transmis',
    'Point d\'étape', 'Validation technique', 'Signature contrat',
    'Appel décideur', 'Présentation comité', 'Suivi client',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-pipeline-${Math.random().toString(36).slice(2, 9)}`,
    type: types[Math.floor(Math.random() * types.length)]!,
    title: titles[Math.floor(Math.random() * titles.length)]!,
    description: Math.random() > 0.4 ? 'Détail de l\'activité enregistrée dans le CRM.' : undefined,
    createdBy: pickRandom(OWNERS).id,
    createdAt: daysAgo(Math.floor(Math.random() * 60) + 1),
  }));
}

function generateHistory(): OpportunityHistoryEntry[] {
  const fields = ['stage', 'probability', 'amount', 'priority', 'ownerId'];
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
    id: `hist-${Math.random().toString(36).slice(2, 9)}`,
    field: fields[Math.floor(Math.random() * fields.length)]!,
    oldValue: 'Ancienne valeur',
    newValue: 'Nouvelle valeur',
    changedBy: pickRandom(OWNERS).id,
    changedAt: daysAgo(Math.floor(Math.random() * 90) + 1),
  }));
}

function generateDocuments(count: number): OpportunityDocument[] {
  const docTypes = ['PDF', 'DOCX', 'XLSX', 'PPTX'];
  const docNames = ['Proposition_Commerciale', 'Devis', 'Contrat', 'Cahier_Charges', 'Presentation', 'Fiche_Technique'];
  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${Math.random().toString(36).slice(2, 9)}`,
    name: `${pickRandom(docNames)}_${i + 1}.${pickRandom(docTypes).toLowerCase()}`,
    type: pickRandom(docTypes),
    url: '#',
    uploadedBy: pickRandom(OWNERS).id,
    uploadedAt: daysAgo(Math.floor(Math.random() * 30)),
    size: Math.floor(Math.random() * 5000) + 100,
  }));
}

export const PIPELINE_OPPORTUNITIES: Opportunity[] = OPPORTUNITY_NAMES.map((name, index) => {
  const stageIndex = index % STAGES.length;
  const stage = STAGES[stageIndex]!;
  const company = COMPANIES[index % COMPANIES.length]!;
  const contact = CONTACTS[index % CONTACTS.length]!;
  const owner = OWNERS[index % OWNERS.length]!;
  const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)]!;
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]!;
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)]!;
  const pipeline = PIPELINES[Math.floor(Math.random() * PIPELINES.length)]!;

  let probability: number;
  switch (stage) {
    case 'prospecting': probability = 10 + Math.floor(Math.random() * 15); break;
    case 'qualification': probability = 25 + Math.floor(Math.random() * 15); break;
    case 'proposal': probability = 45 + Math.floor(Math.random() * 15); break;
    case 'negotiation': probability = 65 + Math.floor(Math.random() * 15); break;
    case 'contract_sent': probability = 85 + Math.floor(Math.random() * 10); break;
    case 'closed_won': probability = 100; break;
    case 'closed_lost': probability = 0; break;
  }

  const amountOptions = [25000, 45000, 60000, 85000, 120000, 180000, 250000, 350000, 500000, 750000, 1000000, 1500000];
  const amount = amountOptions[Math.floor(Math.random() * amountOptions.length)]!;
  const createdAt = daysAgo(Math.floor(Math.random() * 180) + 30);
  const lastActivityAt = Math.random() > 0.15 ? daysAgo(Math.floor(Math.random() * 14)) : undefined;
  const expectedCloseDate = stage !== 'closed_won' && stage !== 'closed_lost'
    ? daysFromNow(Math.floor(Math.random() * 120) + 15)
    : stage === 'closed_won'
      ? daysAgo(Math.floor(Math.random() * 30) + 1)
      : undefined;

  let status: 'active' | 'on_hold' | 'won' | 'lost' | 'abandoned';
  if (stage === 'closed_won') status = 'won';
  else if (stage === 'closed_lost') status = 'lost';
  else if (Math.random() > 0.9) status = 'on_hold';
  else status = 'active';

  const notesOptions = [
    'Projet stratégique en cours de validation.',
    'Contact très intéressé par notre solution SaaS.',
    'Négociation avancée sur les conditions tarifaires.',
    'Démonstration effectuée avec succès.',
    'Budget validé par le comité de direction.',
    'Concurrent identifié en phase finale.',
    'Client fidèle - renouvellement annuel.',
    'POC en cours - résultats attendus.',
    'Signature imminente - contrat chez le juridique.',
    'Premier contact prometteur - à relancer.',
  ];

  return {
    id: `pipeline-opp-${index + 1}`,
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
    description: `Projet ${name} pour ${company.name}. Contact principal : ${contact.name}.`,
    notes: Math.random() > 0.3 ? notesOptions[Math.floor(Math.random() * notesOptions.length)] : undefined,
    tags: pickRandomN(TAGS_POOL, 1, 4),
    history: generateHistory(),
    documents: generateDocuments(Math.floor(Math.random() * 4)),
    activities: generateActivities(Math.floor(Math.random() * 6) + 1),
  };
});

/**
 * Données enrichies pour le drawer de détail rapide.
 */
export interface PipelineQuickDetails {
  summary: string;
  company: { id: string; name: string; industry?: string; logo?: string };
  contact: { id: string; name: string; email?: string; phone?: string; avatar?: string };
  history: OpportunityHistoryEntry[];
  notes: string[];
  documents: OpportunityDocument[];
  activities: OpportunityActivity[];
}

export function getPipelineQuickDetails(opportunity: Opportunity): PipelineQuickDetails {
  return {
    summary: opportunity.description ?? 'Aucune description disponible.',
    company: {
      id: opportunity.companyId ?? '',
      name: opportunity.companyName ?? 'Inconnue',
      industry: Math.random() > 0.5 ? ['Tech', 'Finance', 'Industrie', 'Services'][Math.floor(Math.random() * 4)] : undefined,
    },
    contact: {
      id: opportunity.contactId ?? '',
      name: opportunity.contactName ?? 'Inconnu',
      email: `${(opportunity.contactName ?? 'contact').toLowerCase().replace(/\s/g, '.')}@${(opportunity.companyName ?? 'company').toLowerCase().replace(/\s/g, '')}.ma`,
      phone: Math.random() > 0.3 ? `+212 6${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}` : undefined,
    },
    history: opportunity.history.length > 0 ? opportunity.history : generateHistory(),
    notes: opportunity.notes ? [opportunity.notes, ...notesPool()] : notesPool(),
    documents: opportunity.documents.length > 0 ? opportunity.documents : generateDocuments(2),
    activities: opportunity.activities.length > 0 ? opportunity.activities : generateActivities(3),
  };
}

function notesPool(): string[] {
  return [
    'Discussion téléphonique productive avec le client.',
    'Envoi de la proposition commerciale révisée.',
    'Réunion avec l\'équipe technique pour valider le périmètre.',
    'Relance client effectuée - en attente de retour.',
    'Point d\'étape hebdomadaire avec le commercial.',
  ];
}

