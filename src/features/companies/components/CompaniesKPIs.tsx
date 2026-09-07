import { Building2, Users, UserPlus, Banknote } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import type { Company } from '@/types/company.types';
import { formatCurrency } from '@/utils/formatCurrency';

export interface CompaniesKPIsProps {
  companies: Company[];
}

function isThisMonth(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function CompaniesKPIs({ companies }: CompaniesKPIsProps) {
  const total = companies.length;
  const active = companies.filter((c) => c.status === 'active').length;
  const newThisMonth = companies.filter((c) =>
    isThisMonth(c.createdAt),
  ).length;
  const totalEstimatedValue = companies.reduce(
    (sum, c) => sum + (c.estimatedRevenue ?? 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      <KPICard
        icon={Building2}
        label="Total entreprises"
        value={total.toLocaleString('fr-FR')}
        description="Tous statuts confondus"
      />
      <KPICard
        icon={Users}
        label="Clients actifs"
        value={active.toLocaleString('fr-FR')}
        description="En relation commerciale"
      />
      <KPICard
        icon={UserPlus}
        label="Nouveaux ce mois"
        value={newThisMonth.toLocaleString('fr-FR')}
        description="Créés depuis le 1er du mois"
      />
      <KPICard
        icon={Banknote}
        label="Valeur totale estimée"
        value={formatCurrency(totalEstimatedValue)}
        description="Chiffre d'affaires cumulé"
      />
    </div>
  );
}

