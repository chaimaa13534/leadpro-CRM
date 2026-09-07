import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatDate';

const MOCK_ACTIVITIES = [
  { id: '1', type: 'Appel', description: 'Appel de qualification — 15 min', date: '2026-02-01T11:00:00Z' },
  { id: '2', type: 'Email', description: 'Envoi de la proposition commerciale', date: '2026-02-10T09:30:00Z' },
  { id: '3', type: 'Réunion', description: 'Démonstration produit — 45 min', date: '2026-02-15T14:00:00Z' },
  { id: '4', type: 'Tâche', description: 'Relancer pour signature contrat', date: '2026-03-05T08:00:00Z' },
];

export function ContactActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {MOCK_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-body text-text-primary">
                  {activity.description}
                </p>
              </div>
              <span className="shrink-0 text-caption text-text-secondary/60">
                {formatDate(activity.date, 'short')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

