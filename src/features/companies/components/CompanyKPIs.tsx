import { Users, Target, Banknote, GitBranch } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Company } from '@/types/company.types';

export interface CompanyKPIsProps {
  company: Company;
}

export function CompanyKPIs({ company }: CompanyKPIsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      <KPICard
        icon={Users}
        label="Contacts liés"
        value={String(company.linkedContactIds.length)}
        description="Collaborateurs référencés"
      />
      <KPICard
        icon={Target}
        label="Leads liés"
        value={String(company.linkedLeadIds.length)}
        description="Prospects en cours"
      />
      <KPICard
        icon={GitBranch}
        label="Opportunités"
        value={String(company.linkedOpportunityIds.length)}
        description="Affaires en pipeline"
      />
      <KPICard
        icon={Banknote}
        label="CA estimé"
        value={
          company.estimatedRevenue
            ? formatCurrency(company.estimatedRevenue)
            : '—'
        }
        description="Chiffre d'affaires annuel"
      />
    </div>
  );
}

