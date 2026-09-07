import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { buildEditOpportunityPath } from '@/lib/constants/routes.constants';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunityQuickActionsProps {
  opportunity: Opportunity;
}

export function OpportunityQuickActions({ opportunity }: OpportunityQuickActionsProps) {
  const navigate = useNavigate();
  const { info } = useNotifications();

  return (
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
        leadingIcon={<Icons.note className="size-3.5" />}
        onClick={() => info("Les notes rapides seront disponibles prochainement.")}
      >
        Note rapide
      </Button>
      <Button
        size="sm"
        leadingIcon={<Icons.edit className="size-3.5" />}
        onClick={() => navigate(buildEditOpportunityPath(opportunity.id))}
      >
        Modifier
      </Button>
    </div>
  );
}

