import type { Lead } from '@/types/lead.types';
import type { LeadDocument } from '@/features/leads/types';
import { hashString } from '@/utils/hashString';

const AUTHORS = ['Sara Idrissi', 'Yassine Bennani', 'Omar Chraibi'];

const DOCUMENT_TEMPLATES: {
  fileName: string;
  fileType: LeadDocument['fileType'];
}[] = [
  { fileName: 'contrat.pdf', fileType: 'pdf' },
  { fileName: 'devis.pdf', fileType: 'pdf' },
  { fileName: 'presentation.pdf', fileType: 'pdf' },
];

/** Génère les documents associés à un lead, de façon déterministe. */
export function getDocumentsForLead(lead: Lead): LeadDocument[] {
  const seed = hashString(lead.id);
  const createdAtMs = new Date(lead.createdAt).getTime();

  return DOCUMENT_TEMPLATES.map((template, index) => ({
    id: `${lead.id}-document-${index}`,
    leadId: lead.id,
    fileName: template.fileName,
    fileType: template.fileType,
    fileSizeKb: 180 + ((seed + index * 97) % 900),
    uploadedBy: AUTHORS[(seed + index) % AUTHORS.length]!,
    uploadedAt: new Date(
      createdAtMs + (index + 1) * 3 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }));
}
