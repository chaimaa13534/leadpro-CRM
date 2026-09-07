import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';
import { roleBadgeVariant, roleLabel } from '../constants/user-roles.constants';
import type { ManagedUser } from '../types/user-management.types';

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: ManagedUser | null;
}

/** Render a single label/value row in the details modal. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-[13px] text-text-tertiary">{label}</dt>
      <dd className="text-[13px] font-medium text-text-primary text-right">
        {value}
      </dd>
    </div>
  );
}

/**
 * Read-only details view of a user (used as a drawer/modal).
 */
export function UserDetailsModal({
  open,
  onClose,
  user,
}: UserDetailsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails de l’utilisateur"
      description={
        user ? `${user.firstName} ${user.lastName}` : 'Chargement…'
      }
      size="md"
    >
      {user && (
        <div className="flex flex-col gap-5">
          {/* Identity header */}
          <div className="flex items-center gap-4">
            <Avatar
              firstName={user.firstName}
              lastName={user.lastName}
              src={user.avatar ?? undefined}
              size="lg"
            />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-text-primary">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-[13px] text-text-tertiary">
                {user.email}
              </p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1.5">
              <Badge variant={roleBadgeVariant(user.role)}>
                {roleLabel(user.role)}
              </Badge>
              <Badge
                variant={user.isActive ? 'success' : 'danger'}
                dot
              >
                {user.isActive ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <dl className="divide-y divide-border rounded-xl border border-border px-4">
            <DetailRow label="ID" value={String(user.id)} />
            <DetailRow
              label="Téléphone"
              value={user.phone ?? 'Non renseigné'}
            />
            <DetailRow label="Rôle" value={roleLabel(user.role)} />
            <DetailRow
              label="Créé le"
              value={formatDate(user.createdAt, 'datetime')}
            />
            <DetailRow
              label="Mis à jour le"
              value={formatDate(user.updatedAt, 'datetime')}
            />
          </dl>
        </div>
      )}
    </Modal>
  );
}
