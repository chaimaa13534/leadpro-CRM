import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { USER_ROLE_OPTIONS } from '../constants/user-roles.constants';
import type {
  CreateManagedUserInput,
  ManagedUser,
  UserManagementRole,
  UpdateManagedUserInput,
} from '../types/user-management.types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal is in "edit" mode for this user. */
  user: ManagedUser | null;
  isSubmitting: boolean;
  onSubmit: (input: CreateManagedUserInput | UpdateManagedUserInput) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserManagementRole;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'sales',
  isActive: true,
};

/** Build the initial form state given the user being edited (or null). */
function buildInitialState(user: ManagedUser | null): FormState {
  if (!user) return EMPTY_FORM;
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? '',
    password: '',
    role: user.role,
    isActive: user.isActive,
  };
}

function validateForm(form: FormState, isEdit: boolean): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.firstName.trim()) errors.firstName = 'Le prénom est requis.';
  if (!form.lastName.trim()) errors.lastName = 'Le nom est requis.';
  if (!form.email.trim()) errors.email = "L'email est requis.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
    errors.email = 'Adresse email invalide.';
  if (!isEdit && form.password.length < 8)
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  if (form.phone && form.phone.length > 30)
    errors.phone = 'Le téléphone ne doit pas dépasser 30 caractères.';

  return errors;
}

/**
 * Modal dialog used for both creating and editing a user.
 * In edit mode the password field is shown but optional (backend ignores it).
 */
export function UserFormModal({
  open,
  onClose,
  user,
  isSubmitting,
  onSubmit,
}: UserFormModalProps) {
  const isEdit = user !== null;

  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(user),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the target user (or open state) changes.
  useEffect(() => {
    if (open) {
      setForm(buildInitialState(user));
      setErrors({});
    }
  }, [open, user]);

  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validateForm(form, isEdit);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isEdit && user) {
      const input: UpdateManagedUserInput = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        role: form.role,
        isActive: form.isActive,
      };
      onSubmit(input);
      return;
    }

    const input: CreateManagedUserInput = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone || undefined,
      isActive: form.isActive,
    };
    onSubmit(input);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier l’utilisateur' : 'Créer un utilisateur'}
      description={
        isEdit
          ? 'Mettez à jour les informations de ce compte.'
          : 'Créez un nouveau compte utilisateur pour votre équipe.'
      }
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Prénom"
            value={form.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            error={errors.firstName}
            placeholder="Jean"
            required
          />
          <Input
            label="Nom"
            value={form.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            error={errors.lastName}
            placeholder="Dupont"
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
          error={errors.email}
          placeholder="jean.dupont@example.com"
          disabled={isEdit}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Téléphone"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            error={errors.phone}
            placeholder="+33 6 12 34 56 78"
          />
          <Select
            label="Rôle"
            value={form.role}
            onChange={(e) =>
              update({ role: e.target.value as UserManagementRole })
            }
            options={USER_ROLE_OPTIONS}
          />
        </div>

        {!isEdit && (
          <Input
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
            error={errors.password}
            placeholder="8 caractères minimum"
            required
          />
        )}

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            checked={form.isActive}
            onChange={(e) => update({ isActive: e.target.checked })}
            label="Compte actif"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
}
