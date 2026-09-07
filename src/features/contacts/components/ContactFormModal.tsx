import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@/lib/zod-resolver';
import {
  contactFormSchema,
  type ContactFormValues,
} from '../schemas/contact-management.schema';
import type {
  CreateManagedContactInput,
  ManagedContact,
  UpdateManagedContactInput,
} from '../types/contact-management.types';

/** A selectable company option (real API data). The value is a string
 * representation of the company id, matching the `<Select>` API. */
export interface ContactCompanyOption {
  value: string;
  label: string;
}

/** A selectable owner/user option (real API data). */
export interface ContactOwnerOption {
  value: string;
  label: string;
}

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal is in "edit" mode for this contact. */
  contact: ManagedContact | null;
  companyOptions: ContactCompanyOption[];
  ownerOptions: ContactOwnerOption[];
  isSubmitting: boolean;
  onSubmit: (
    input: CreateManagedContactInput | UpdateManagedContactInput,
  ) => void;
}

/**
 * Modal "Ajouter / Modifier un contact". Récupère les entreprises et les
 * responsables depuis les vraies API et valide le formulaire avec React
 * Hook Form + Zod (schéma partagé `contactFormSchema`).
 */
export function ContactFormModal({
  open,
  onClose,
  contact,
  companyOptions,
  ownerOptions,
  isSubmitting,
  onSubmit,
}: ContactFormModalProps) {
  const isEdit = contact !== null;

  const defaultValues = useMemo<ContactFormValues>(() => {
    if (!contact) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        companyId: companyOptions[0]?.value ?? 0,
        ownerId: ownerOptions[0]?.value ?? 0,
        notes: '',
      };
    }

    return {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      position: contact.position ?? '',
      companyId: contact.company.id,
      ownerId: contact.owner.id,
      notes: contact.notes ?? '',
    };
  }, [contact, companyOptions, ownerOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  // Re-sync the form whenever the contact being edited (or open state) changes.
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = (values: ContactFormValues) => {
    if (isEdit && contact) {
      const input: UpdateManagedContactInput = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || undefined,
        phone: values.phone || undefined,
        position: values.position || undefined,
        companyId: values.companyId,
        ownerId: values.ownerId,
        notes: values.notes || undefined,
      };
      onSubmit(input);
      return;
    }

    const input: CreateManagedContactInput = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      position: values.position || undefined,
      companyId: values.companyId,
      ownerId: values.ownerId,
      notes: values.notes || undefined,
    };
    onSubmit(input);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier le contact' : 'Ajouter un contact'}
      description={
        isEdit
          ? 'Mettez à jour les informations de ce contact.'
          : 'Renseignez les informations de votre nouveau contact.'
      }
      size="lg"
    >
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Prénom"
            placeholder="Jean"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Nom"
            placeholder="Dupont"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            placeholder="jean.dupont@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Téléphone"
            placeholder="+33 6 12 34 56 78"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <Input
          label="Poste"
          placeholder="Directeur commercial"
          error={errors.position?.message}
          {...register('position')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Entreprise"
            error={errors.companyId?.message}
            options={companyOptions.map((o) => ({
              value: String(o.value),
              label: o.label,
            }))}
            {...register('companyId')}
          />
          <Select
            label="Responsable"
            error={errors.ownerId?.message}
            options={ownerOptions.map((o) => ({
              value: String(o.value),
              label: o.label,
            }))}
            {...register('ownerId')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-text-secondary">
            Notes
          </label>
          <Textarea
            placeholder="Notes internes sur ce contact…"
            hasError={Boolean(errors.notes?.message)}
            rows={4}
            {...register('notes')}
          />
{errors.notes?.message && (
            <p className="text-[12px] font-medium text-danger-400" role="alert">
              {errors.notes.message}
            </p>
          )}
        </div>
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
