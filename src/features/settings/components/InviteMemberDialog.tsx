/* ═════════════════════════════════════════════════════════════════════
   Settings — InviteMemberDialog
   Dialogue d’invitation d’un membre d’équipe (React Hook Form + Zod).
   Aucune invitation réelle n’est envoyée.
   ═════════════════════════════════════════════════════════════════════ */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@/lib/zod-resolver';
import { inviteMemberSchema, type InviteMemberFormValues } from '@/features/settings/schemas';
import { departmentsMock, rolesMock } from '@/features/settings/mocks';

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (values: InviteMemberFormValues) => Promise<void> | void;
  sending?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function InviteMemberDialog({
  open,
  onClose,
  onInvite,
  sending = false,
}: InviteMemberDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'sales_rep',
      department: '',
      message: '',
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        role: 'sales_rep',
        department: '',
        message: '',
      });
    }
  }, [open, reset]);

  const roleOptions = rolesMock.map((role) => ({
    label: role.label,
    value: role.key,
  }));

  const departmentOptions = departmentsMock.map((department) => ({
    label: department,
    value: department,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite a member"
      description="Envoyez une invitation à rejoindre votre espace de travail."
      size="md"
    >
      <form onSubmit={handleSubmit(onInvite)} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            placeholder="Marie"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Dupont"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="marie.dupont@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />
          <Select
            label="Department"
            placeholder="Select a department"
            options={departmentOptions}
            error={errors.department?.message}
            {...register('department')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="invite-message"
            className="text-[12px] font-medium text-text-secondary"
          >
            Message (optionnel)
          </label>
          <textarea
            id="invite-message"
            rows={3}
            placeholder="Un mot pour votre futur collègue…"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled outline-none transition-all duration-150 hover:border-border-hover focus:border-accent focus:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]"
            {...register('message')}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button type="submit" loading={sending}>
            Send invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default InviteMemberDialog;

