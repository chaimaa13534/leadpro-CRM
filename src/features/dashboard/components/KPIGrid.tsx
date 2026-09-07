import {
  Target,
  UserPlus,
  GitBranch,
  Wallet,
  TrendingUp,
  CalendarClock,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { dashboardStatsMock } from '@/mocks/dashboard.mock';
import { calendarEventsMock } from '@/mocks/calendar.mock';
import { formatCurrency } from '@/utils/formatCurrency';
import { isToday } from '@/utils/isToday';

const meetingsTodayCount = calendarEventsMock.filter((event) =>
  isToday(event.startTime),
).length;

/**
 * Grille des 6 indicateurs clés du Dashboard. Les valeurs viennent de
 * `dashboardStatsMock` (agrégats) et `calendarEventsMock` (RDV du jour) ;
 * les variations en % sont des valeurs de démonstration cohérentes avec
 * la tendance générale des graphiques, pas des calculs sur les mocks.
 */
export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-6">
      <KPICard
        icon={Target}
        label="Total Leads"
        value={dashboardStatsMock.totalLeads.toLocaleString('fr-FR')}
        change={12.4}
        description="sur les 30 derniers jours"
      />
      <KPICard
        icon={UserPlus}
        label="Nouveaux Leads"
        value="38"
        change={8.1}
        description="cette semaine"
      />
      <KPICard
        icon={GitBranch}
        label="Opportunités"
        value={dashboardStatsMock.openOpportunities.toLocaleString('fr-FR')}
        change={4.2}
        description="opportunités ouvertes"
      />
      <KPICard
        icon={Wallet}
        label="Revenu"
        value={formatCurrency(dashboardStatsMock.wonOpportunitiesValue)}
        change={15.7}
        description="chiffre d'affaires gagné"
      />
      <KPICard
        icon={TrendingUp}
        label="Taux de conversion"
        value={`${dashboardStatsMock.conversionRate.toFixed(1)}%`}
        change={-2.1}
        description="lead → client"
      />
      <KPICard
        icon={CalendarClock}
        label="RDV aujourd'hui"
        value={String(meetingsTodayCount)}
        description="réunions planifiées"
      />
    </div>
  );
}
