import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface CompanyNotesProps {
  notes?: string;
}

export function CompanyNotes({ notes }: CompanyNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {notes ? (
          <p className="text-body text-text-primary whitespace-pre-wrap">
            {notes}
          </p>
        ) : (
          <p className="text-caption text-text-secondary/60">
            Aucune note pour cette entreprise.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

