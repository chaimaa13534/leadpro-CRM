import { Badge } from '@/components/ui/Badge';
import type { ContactStatus } from '@/types/contact.types';

export interface ContactStatusBadgeProps {
  status: ContactStatus;
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; variant: 'success' | 'neutral' | 'warning' }> = {
  active: { label: 'Actif', variant: 'success' },
  inactive: { label: 'Inactif', variant: 'neutral' },
  vip: { label: 'VIP', variant: 'warning' },
};

export function ContactStatusBadge({ status }: ContactStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant} size="sm" dot>
      {config.label}
    </Badge>
  );
}

