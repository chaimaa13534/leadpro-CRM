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
  companyFormSchema,
  type CompanyFormValues,
} from '../schemas/company-management.schema';
import type {
  CreateManagedCompanyInput,
  ManagedCompany,
  UpdateManagedCompanyInput,
} from '../types/company-management.types';

/** A minimal owner option for the responsible-user select. */
export interface CompanyOwnerOption {
  value: number;
  label: string;
}

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal is in "edit" mode for this company. */
  company: ManagedCompany | null;
  ownerOptions: CompanyOwnerOption[];
  isSubmitting: boolean;
  onSubmit: (
    input: CreateManagedCompanyInput | UpdateManagedCompanyInput,
  ) => void;
}

/**
 * Modal "Ajouter / Modifier une entreprise". Valide le formulaire avec
 * React Hook Form + Zod (schéma partagé `companyFormSchema`).
 */
export function CompanyFormModal({
  open,
  onClose,
  company,
  ownerOptions,
  isSubmitting,
  onSubmit,
}: CompanyFormModalProps) {
  const isEdit = company !== null;

  const defaultValues = useMemo<CompanyFormValues>(() => {
    if (!company) {
      return {
        name: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        country: '',
        description: '',
        ownerId: ownerOptions[0]?.value ?? 0,
      };
    }

    return {
      name: company.name,
      industry: company.industry ?? '',
      website: company.website ?? '',
      phone: company.phone ?? '',
      email: company.email ?? '',
      address: company.address ?? '',
      city: company.city ?? '',
      country: company.country ?? '',
      description: company.description ?? '',
      ownerId: company.owner.id,
    };
  }, [company, ownerOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  // Re-sync the form whenever the target company (or open state) changes.
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = (values: CompanyFormValues) => {
    if (isEdit && company) {
      const input: UpdateManagedCompanyInput = {
        name: values.name,
        industry: values.industry || undefined,
        website: values.website || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        description: values.description || undefined,
        ownerId: values.ownerId,
      };
      onSubmit(input);
      return;
    }

    const input: CreateManagedCompanyInput = {
      name: values.name,
      industry: values.industry || undefined,
      website: values.website || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      country: values.country || undefined,
      description: values.description || undefined,
      ownerId: values.ownerId,
    };
    onSubmit(input);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier l’entreprise' : 'Ajouter une entreprise'}
      description={
        isEdit
          ? 'Mettez à jour les informations de cette entreprise.'
          : 'Renseignez les informations de votre nouvelle entreprise.'
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
          <Input
            label="Nom"
            placeholder="Acme Corporation"
            error={errors.name?.message}
            {...register('name')}
          />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Secteur"
            placeholder="Technologie"
            error={errors.industry?.message}
            {...register('industry')}
          />
          <Input
            label="Site web"
            placeholder="https://acme.com"
            error={errors.website?.message}
            {...register('website')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Téléphone"
            placeholder="+33 1 23 45 67 89"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contact@acme.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <Input
          label="Adresse"
          placeholder="12 rue de la Paix"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Ville"
            placeholder="Paris"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Pays"
            placeholder="France"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

<Select
          label="Responsable"
          error={errors.ownerId?.message}
          options={ownerOptions.map((o) => ({
            value: String(o.value),
            label: o.label,
          }))}
          {...register('ownerId')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-text-secondary">
            Description
          </label>
          <Textarea
            placeholder="Une brève description de l'entreprise…"
            hasError={Boolean(errors.description?.message)}
            rows={4}
            {...register('description')}
          />
{errors.description?.message && (
            <p className="text-[12px] font-medium text-danger-400" role="alert">
              {errors.description.message}
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
