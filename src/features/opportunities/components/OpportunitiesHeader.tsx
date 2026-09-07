import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { ROUTES } from '@/lib/constants/routes.constants';
import { formatCurrency } from '@/utils/formatCurrency';

export interface OpportunitiesHeaderProps {
  totalCount: number;
  totalPipelineValue: number;
}

export function OpportunitiesHeader({
  totalCount,
  totalPipelineValue,
}: OpportunitiesHeaderProps) {
  const navigate = useNavigate();
  const { info } = useNotifications();

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-primary-50/60 to-transparent px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-h2 font-semibold tracking-tight text-primary-800">
          Opportunities
        </h1>
        <p className="text-body text-text-secondary">
          <span className="font-medium text-text-primary">
            {totalCount.toLocaleString('fr-FR')}
          </span>{' '}
          opportunités ·{' '}
          <span className="font-medium text-text-primary">
            {formatCurrency(totalPipelineValue)}
          </span>{' '}
          valeur totale du pipeline
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Icons.export className="size-3.5" />}
          onClick={() => info("L'export sera disponible prochainement.")}
        >
          Exporter
        </Button>
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Icons.add className="size-3.5" />}
          onClick={() => info("L'import sera disponible prochainement.")}
        >
          Importer
        </Button>
        <Button
          size="sm"
          leadingIcon={<Icons.add className="size-3.5" />}
          onClick={() => navigate(ROUTES.NEW_OPPORTUNITY)}
        >
          Nouvelle Opportunité
        </Button>
      </div>
    </div>
  );
}

