import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';
import type { OpportunityDocument } from '@/types/opportunity.types';

export interface OpportunityDocumentsProps {
  documents?: OpportunityDocument[];
}

export function OpportunityDocuments({ documents = [] }: OpportunityDocumentsProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Icons.file className="size-8 text-text-tertiary" aria-hidden="true" />
          <p className="text-body text-text-secondary">
            Aucun document lié à cette opportunité.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors duration-150 hover:bg-muted/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background-tertiary">
                <Icons.file className="size-4 text-text-secondary" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-text-primary">
                  {doc.name}
                </p>
                <p className="text-caption text-text-secondary/60">
                  {doc.type} · {formatDate(doc.uploadedAt, 'short')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

