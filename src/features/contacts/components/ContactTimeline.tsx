import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';

// Timeline simulée pour un contact
const MOCK_TIMELINE = [
  { id: '1', type: 'created' as const, title: 'Contact créé', date: '2026-01-15T10:00:00Z' },
  { id: '2', type: 'email' as const, title: 'Email envoyé — Présentation', date: '2026-01-20T14:30:00Z' },
  { id: '3', type: 'call' as const, title: 'Appel téléphonique — Qualification', date: '2026-02-01T11:00:00Z' },
  { id: '4', type: 'meeting' as const, title: 'Réunion — Démonstration produit', date: '2026-02-15T09:00:00Z' },
  { id: '5', type: 'note' as const, title: 'Note ajoutée — Suivi client', date: '2026-03-01T16:00:00Z' },
];

export interface ContactTimelineProps {
  compact?: boolean;
}

export function ContactTimeline({ compact = false }: ContactTimelineProps) {
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

