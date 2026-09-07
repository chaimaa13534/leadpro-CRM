import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';

export interface OpportunityNotesProps {
  notes?: string;
}

export function OpportunityNotes({ notes }: OpportunityNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {notes ? (
          <p className="text-body text-text-primary leading-relaxed whitespace-pre-wrap">
            {notes}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Icons.note className="size-8 text-text-tertiary" aria-hidden="true" />
            <p className="text-body text-text-secondary">
              Aucune note pour cette opportunité.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

