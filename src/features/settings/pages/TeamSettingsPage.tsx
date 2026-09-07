/* ═════════════════════════════════════════════════════════════════════
   Settings — TeamSettingsPage
   Tableau des membres + dialogue d’invitation.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { TeamTable } from '@/features/settings/components/TeamTable';
import { InviteMemberDialog } from '@/features/settings/components/InviteMemberDialog';
import { useNotifications } from '@/hooks/useNotifications';
import { teamMock } from '@/features/settings/mocks';
import type { TeamMember } from '@/features/settings/types';
import type { InviteMemberFormValues } from '@/features/settings/schemas';

/* ═══════════════════════════════════════════════════════ */
export function TeamSettingsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(teamMock);
  const { success } = useNotifications();

  const handleEdit = (member: TeamMember) => {
    success(`Editing ${member.firstName} ${member.lastName} (simulated).`);
  };

  const handleRemove = async (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    success('Member removed.');
  };

  const handleInvite = async (values: InviteMemberFormValues) => {
    setInviteOpen(false);
    success(`Invitation sent to ${values.email}`);
  };

  return (
    <div>
      <SettingsHeader
        title="Team"
        description="Manage your team members and their roles."
      />
      <TeamTable
        members={members}
        onInvite={() => setInviteOpen(true)}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />
      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

export default TeamSettingsPage;

