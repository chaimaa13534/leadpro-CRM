/* ═════════════════════════════════════════════════════════════════════
   Settings — AccountSettingsPage
   Account ID, email, username, statut, dates, changer email/username,
   zone de danger (désactiver / supprimer le compte).
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IdCard,
  Mail,
  User,
  ShieldCheck,
  CalendarDays,
  LogIn,
  AlertTriangle,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNotifications } from '@/hooks/useNotifications';
import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { DangerZone } from '@/features/settings/components/DangerZone';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { formatDate } from '@/utils/formatDate';
import { profileMock } from '@/features/settings/mocks';

/* ═══════════════════════════════════════════════════════ */
export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { success, error } = useNotifications();

  const [emailEditOpen, setEmailEditOpen] = useState(false);
  const [usernameEditOpen, setUsernameEditOpen] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleChangeEmail = () => {
    if (!newEmail.trim()) {
      error('Veuillez saisir un email.');
      return;
    }
    success('Email updated (simulated).');
    setEmailEditOpen(false);
    setNewEmail('');
  };

  const handleChangeUsername = () => {
    if (!newUsername.trim()) {
      error('Veuillez saisir un nom d’utilisateur.');
      return;
    }
    success('Username updated (simulated).');
    setUsernameEditOpen(false);
    setNewUsername('');
  };

  const handleDeactivate = () => {
    setConfirmDeactivate(false);
    success('Account deactivated (simulated).');
  };

  const handleDelete = () => {
    setConfirmDelete(false);
    success('Account deletion requested (simulated).');
  };

  return (
    <div>
      <SettingsHeader
        title="Account"
        description="Manage your account details and security."
        onBack={() => navigate('/settings')}
      />

      <div className="flex flex-col gap-6">
        {/* Informations du compte */}
        <SettingsSection title="Account information">
          <SettingsCard>
            <SettingsGroup>
              <SettingsRow
                title="Account ID"
                description="Identifiant unique de votre compte."
                icon={<IdCard className="h-4 w-4" />}
              >
                <span className="font-mono text-[12px] text-text-tertiary">
                  {profileMock.id}
                </span>
              </SettingsRow>
              <SettingsRow
                title="Email"
                description="Adresse email de connexion."
                icon={<Mail className="h-4 w-4" />}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-text-primary">
                    {profileMock.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setEmailEditOpen(true)}
                  >
                    Change
                  </Button>
                </div>
              </SettingsRow>
              <SettingsRow
                title="Username"
                description="Nom d’utilisateur pour l’application."
                icon={<User className="h-4 w-4" />}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-text-primary">
                    {profileMock.username ?? '—'}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setUsernameEditOpen(true)}
                  >
                    Change
                  </Button>
                </div>
              </SettingsRow>
              <SettingsRow
                title="Status"
                description="Statut actuel du compte."
                icon={<ShieldCheck className="h-4 w-4" />}
              >
                <Badge variant="success" dot>
                  Active
                </Badge>
              </SettingsRow>
              <SettingsRow
                title="Created at"
                description="Date de création du compte."
                icon={<CalendarDays className="h-4 w-4" />}
              >
                <span className="text-[13px] text-text-primary">
                  {formatDate(profileMock.createdAt)}
                </span>
              </SettingsRow>
              <SettingsRow
                title="Last login"
                description="Dernière connexion réussie."
                icon={<LogIn className="h-4 w-4" />}
              >
                <span className="text-[13px] text-text-primary">
                  {formatDate(profileMock.lastLoginAt ?? profileMock.createdAt)}
                </span>
              </SettingsRow>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone">
          <DangerZone
            actions={[
              {
                title: 'Deactivate account',
                description: 'Désactivez temporairement votre compte.',
                buttonLabel: 'Deactivate',
                danger: true,
                onAction: () => setConfirmDeactivate(true),
              },
              {
                title: 'Delete account',
                description: 'Supprimez définitivement votre compte et toutes vos données.',
                buttonLabel: 'Delete',
                danger: true,
                onAction: () => setConfirmDelete(true),
              },
            ]}
          />
        </SettingsSection>
      </div>

      {/* Dialogues */}
      <Modal
        open={emailEditOpen}
        onClose={() => setEmailEditOpen(false)}
        title="Change email"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="New email"
            type="email"
            placeholder="nouveau@email.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEmailEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeEmail}>Change</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={usernameEditOpen}
        onClose={() => setUsernameEditOpen(false)}
        title="Change username"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="New username"
            placeholder="mon_nouveau_pseudo"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setUsernameEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeUsername}>Change</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmDeactivate}
        onClose={() => setConfirmDeactivate(false)}
        onConfirm={handleDeactivate}
        title="Deactivate account"
        description="Votre compte sera désactivé et vous ne pourrez plus vous connecter. Vous pourrez le réactiver ultérieurement."
        confirmLabel="Deactivate"
        danger
      />

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete account"
        description="Cette action est irréversible. Toutes vos données seront supprimées définitivement."
        confirmLabel="Delete my account"
        danger
      />
    </div>
  );
}

export default AccountSettingsPage;

