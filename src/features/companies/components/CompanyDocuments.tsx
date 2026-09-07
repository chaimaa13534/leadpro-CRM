import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';

const MOCK_DOCUMENTS = [
  { id: '1', name: 'Contrat_cadre_LeadPro_2026.pdf', type: 'PDF' as const, size: '3.2 Mo' },
  { id: '2', name: 'Proposition_commerciale.pptx', type: 'PPT' as const, size: '6.7 Mo' },
  { id: '3', name: 'Devis_formation_equipe.docx', type: 'DOC' as const, size: '1.5 Mo' },
  { id: '4', name: 'Facture_2026-03.pdf', type: 'PDF' as const, size: '0.8 Mo' },
];

export function CompanyDocuments() {
  if (MOCK_DOCUMENTS.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-caption text-text-secondary/60">
            Aucun document associé à cette entreprise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {MOCK_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                <Icons.note className="size-4 text-primary-500" aria-hidden="true" />
                <div>
                  <p className="text-body font-medium text-text-primary">
                    {doc.name}
                  </p>
                  <p className="text-caption text-text-secondary/60">{doc.type}</p>
                </div>
              </div>
              <span className="text-caption text-text-secondary/60">{doc.size}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

