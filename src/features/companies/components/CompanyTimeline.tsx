import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';

const MOCK_TIMELINE = [
  { id: '1', type: 'created' as const, title: 'Entreprise créée', date: '2026-01-10T08:00:00Z' },
  { id: '2', type: 'contact' as const, title: 'Premier contact établi — Appel commercial', date: '2026-01-18T10:30:00Z' },
  { id: '3', type: 'meeting' as const, title: 'Réunion de présentation produit', date: '2026-02-05T14:00:00Z' },
  { id: '4', type: 'email' as const, title: 'Proposition commerciale envoyée', date: '2026-02-20T09:00:00Z' },
  { id: '5', type: 'note' as const, title: 'Note interne — Suivi client prioritaire', date: '2026-03-08T16:00:00Z' },
  { id: '6', type: 'opportunity' as const, title: 'Opportunité créée — Contrat cadre', date: '2026-03-15T11:00:00Z' },
];

export interface CompanyTimelineProps {
  compact?: boolean;
}

export function CompanyTimeline({ compact = false }: CompanyTimelineProps) {
  const items = compact ? MOCK_TIMELINE.slice(-3) : MOCK_TIMELINE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-4 pl-6 before:absolute before:top-1 before:bottom-1 before:left-2 before:w-0.5 before:bg-border/60">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -left-4 flex size-3 items-center justify-center rounded-full bg-primary-100 ring-2 ring-surface">
                <Icons.statusChange className="size-2 text-primary-600" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-body font-medium text-text-primary">
                  {item.title}
                </p>
                <p className="text-caption text-text-secondary/70">
                  {formatDate(item.date, 'medium')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

