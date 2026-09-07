import { Users, UserPlus, BadgeCheck, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import type { Lead } from '@/types/lead.types';

export interface LeadsKPIsProps {
  leads: Lead[];
}

function isThisMonth(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

/**
 * Quatre indicateurs calculés en temps réel — design aéré.
 * Chaque KPI est une carte indépendante avec icône, valeur et description
 * minimales. La grille s'adapte du mobile (1 colonne) au desktop (4).
 */
export function LeadsKPIs({ leads }: LeadsKPIsProps) {
  const total = leads.length;
  const newThisMonth = leads.filter((lead) =>
    isThisMonth(lead.createdAt),
  ).length;
  const qualified = leads.filter((lead) => lead.status === 'qualified').length;
  const converted = leads.filter((lead) => lead.status === 'converted').length;
  const conversionRate = total > 0 ? (converted / total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      <KPICard
        icon={Users}
        label="Total Leads"
        value={total.toLocaleString('fr-FR')}
        description="Tous statuts confondus"
      />
      <KPICard
        icon={UserPlus}
        label="Nouveaux ce mois"
        value={newThisMonth.toLocaleString('fr-FR')}
        description="Créés depuis le 1er du mois"
      />
      <KPICard
        icon={BadgeCheck}
        label="Leads qualifiés"
        value={qualified.toLocaleString('fr-FR')}
        description="Prêts pour opportunité"
      />
      <KPICard
        icon={TrendingUp}
        label="Taux de conversion"
        value={`${conversionRate.toFixed(1)}%`}
        description="Leads convertis en clients"
      />
    </div>
  );
}
