/* ═════════════════════════════════════════════════════════════════════
   Settings — TeamTable
   Tableau de l’équipe : desktop → table, mobile → cartes.
   ═════════════════════════════════════════════════════════════════════ */

import { useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui/Dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { formatDate } from '@/utils/formatDate';
import type { TeamMember, TeamRole } from '@/features/settings/types';

interface TeamTableProps {
  members: TeamMember[];
  onInvite: () => void;
  onEdit: (member: TeamMember) => void;
  onRemove: (memberId: string) => Promise<void> | void;
}

const ROLE_LABELS: Record<TeamRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  sales_rep: 'Sales Rep',
  marketing: 'Marketing',
  viewer: 'Viewer',
};

const STATUS_VARIANTS: Record<TeamMember['status'], 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  invited: 'warning',
  suspended: 'neutral',
};

/* ═══════════════════════════════════════════════════════ */
export function TeamTable({
  members,
  onInvite,
  onEdit,
  onRemove,
}: TeamTableProps) {
  const [pendingRemove, setPendingRemove] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);

  const sorted = useMemo(
    () =>
      [...members].sort((a, b) =>
        a.lastName.localeCompare(b.lastName),
      ),
    [members],
  );

  const handleRemove = async () => {
    if (!pendingRemove) return;
    setRemoving(true);
    try {
      await onRemove(pendingRemove.id);
      setPendingRemove(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop table */}
      <SettingsCard className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      firstName={member.firstName}
                      lastName={member.lastName}
                      src={member.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-text-primary">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-[12px] text-text-tertiary">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="primary">{ROLE_LABELS[member.role]}</Badge>
                </TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[member.status]} dot>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.lastActiveAt ? formatDate(member.lastActiveAt) : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem
                      icon={<Pencil className="h-3.5 w-3.5" />}
                      onClick={() => onEdit(member)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      danger
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => setPendingRemove(member)}
                    >
                      Remove
                    </DropdownItem>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {sorted.map((member) => (
          <SettingsCard key={member.id}>
            <div className="flex items-start justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  src={member.avatarUrl}
                  size="md"
                />
                <div>
                  <p className="text-[13px] font-medium text-text-primary">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-[12px] text-text-tertiary">
                    {member.email}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="primary">{ROLE_LABELS[member.role]}</Badge>
                    <Badge variant={STATUS_VARIANTS[member.status]} dot>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPendingRemove(member)}
                aria-label={`Supprimer ${member.firstName} ${member.lastName}`}
              >
                <Trash2 className="h-4 w-4 text-danger-400" />
              </Button>
            </div>
          </SettingsCard>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={onInvite}
        leadingIcon={<UserPlus className="h-3.5 w-3.5" />}
      >
        Invite member
      </Button>

      <ConfirmationDialog
        open={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        onConfirm={handleRemove}
        title="Retirer le membre"
        description={
          pendingRemove
            ? `Retirer ${pendingRemove.firstName} ${pendingRemove.lastName} de l’équipe ? Cette action peut être annulée.`
            : ''
        }
        confirmLabel="Retirer"
        danger
        loading={removing}
      />
    </div>
  );
}

export default TeamTable;

