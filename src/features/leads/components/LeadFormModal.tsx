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
  leadFormSchema,
  type LeadFormValues,
} from '../schemas/lead-management.schema';
import { LEAD_STATUS_OPTIONS, LEAD_PRIORITY_OPTIONS } from '../constants';
import type {
  CreateManagedLeadInput,
  ManagedLead,
  UpdateManagedLeadInput,
} from '../types/lead-management.types';

/** A selectable option (id as string, label as display). */
export interface LeadSelectOption {
  value: string;
  label: string;
}

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal is in "edit" mode for this lead. */
  lead: ManagedLead | null;
  companyOptions: LeadSelectOption[];
  contactOptions: LeadSelectOption[];
  ownerOptions: LeadSelectOption[];
  sourceOptions: LeadSelectOption[];
  isSubmitting: boolean;
  onSubmit: (
    input: CreateManagedLeadInput | UpdateManagedLeadInput,
  ) => void;
}

/**
 * Modal "Ajouter / Modifier un lead". Récupère les relations (entreprise,
 * contact, responsable, source) depuis les vraies API et valide le
 * formulaire avec React Hook Form + Zod.
 */
export function LeadFormModal({
  open,
  onClose,
  lead,
  companyOptions,
  contactOptions,
  ownerOptions,
  sourceOptions,
  isSubmitting,
  onSubmit,
}: LeadFormModalProps) {
  const isEdit = lead !== null;

  const defaultValues = useMemo<LeadFormValues>(() => {
if (!lead) {
      return {
        companyId: companyOptions[0]?.value ?? '',
        contactId: '',
        ownerId: ownerOptions[0]?.value ?? '',
        sourceId: sourceOptions[0]?.value ?? '',
        status: 'new',
        priority: 'medium',
        estimatedValue: '',
        notes: '',
      };
    }

    return {
      companyId: lead.company ? String(lead.company.id) : '',
      contactId: lead.contact ? String(lead.contact.id) : '',
      ownerId: String(lead.owner.id),
      sourceId: lead.source ? String(lead.source.id) : '',
      status: lead.status,
      priority: lead.priority,
      estimatedValue:
        lead.estimatedValue > 0 ? String(lead.estimatedValue) : '',
      notes: lead.notes ?? '',
    };
  }, [lead, companyOptions, ownerOptions, sourceOptions]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = (values: LeadFormValues) => {
    const companyId = values.companyId
      ? Number(values.companyId)
      : undefined;
    const contactId = values.contactId
      ? Number(values.contactId)
      : undefined;
    const ownerId = Number(values.ownerId);
    const sourceId = values.sourceId ? Number(values.sourceId) : undefined;
    const estimatedValue = values.estimatedValue
      ? Number(values.estimatedValue)
      : undefined;

    if (isEdit && lead) {
      const input: UpdateManagedLeadInput = {
        companyId,
        contactId,
        ownerId,
        sourceId,
        status: values.status,
        priority: values.priority,
        estimatedValue,
        notes: values.notes || undefined,
      };
      onSubmit(input);
      return;
    }

    const input: CreateManagedLeadInput = {
      companyId,
      contactId,
      ownerId,
      sourceId,
      status: values.status,
      priority: values.priority,
      estimatedValue,
      notes: values.notes || undefined,
    };
    onSubmit(input);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier le lead' : 'Ajouter un lead'}
      description={
        isEdit
          ? 'Mettez à jour les informations de ce lead.'
          : 'Renseignez les informations de votre nouveau lead.'
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
            <Select
              label="Entreprise"
              error={errors.companyId?.message}
              options={companyOptions}
              {...register('companyId')}
            />
            <Select
              label="Contact"
              error={errors.contactId?.message}
              options={contactOptions}
              {...register('contactId')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Responsable"
              error={errors.ownerId?.message}
              options={ownerOptions}
              {...register('ownerId')}
            />
            <Select
              label="Source"
              error={errors.sourceId?.message}
              options={sourceOptions}
              {...register('sourceId')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Statut"
              error={errors.status?.message}
              options={LEAD_STATUS_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              {...register('status')}
            />
            <Select
              label="Priorité"
              error={errors.priority?.message}
              options={LEAD_PRIORITY_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              {...register('priority')}
            />
            <Input
              label="Valeur estimée (EUR)"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              error={errors.estimatedValue?.message}
              {...register('estimatedValue')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-text-secondary">
              Notes
            </label>
            <Textarea
              placeholder="Notes internes sur ce lead…"
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

        <div className="mt-2 flex justify-end gap-2 border-t border-border pt-4">
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
