import { Badge } from '@/components/ui/Badge';
import type { CompanyStatus } from '@/types/company.types';

interface CompanyStatusBadgeProps {
  /** Current legacy API contract. */
  active?: boolean;
  /** Newer company status contract; accepted for compatibility. */
  status?: CompanyStatus;
}

/**
 * Badge de statut d'une entreprise. Les entreprises chargées depuis l'API ne
 * sont jamais soft-deleted (le backend les exclut), elles sont donc marquées
 * "Actif". Ce composant reste réutilisable pour un futur statut métier.
 */
export function CompanyStatusBadge({
  active,
  status,
}: CompanyStatusBadgeProps) {
  const resolvedActive =
    typeof active === 'boolean'
      ? active
      : status === 'active' || status === 'lead' || status === undefined;

  const resolvedVariant = status === 'inactive' ? 'danger' : 'success';

  return (
    <Badge
      variant={resolvedActive ? resolvedVariant : 'danger'}
      dot
      size="sm"
    >
      {status === 'lead' ? 'Lead' : status === 'inactive' ? 'Inactif' : 'Actif'}
    </Badge>
  );
}
