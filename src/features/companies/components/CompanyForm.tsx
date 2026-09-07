import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@/lib/zod-resolver';
import {
  companySchema,
  type CompanyFormValues,
} from '@/schemas/company.schema';
import { createCompany, updateCompany } from '@/services/company.service';
import { useNotifications } from '@/hooks/useNotifications';
import { useCompanyDraft } from '@/features/companies/hooks/useCompanyDraft';
import { useUnsavedChangesGuard } from '@/features/companies/hooks/useUnsavedChangesGuard';
import { LeadSection } from '@/features/leads/forms/LeadSection';
import { LeadTextField } from '@/features/leads/forms/LeadTextField';
import { LeadSelect } from '@/features/leads/forms/LeadSelect';
import { LeadPhoneInput } from '@/features/leads/forms/LeadPhoneInput';
import { LeadNotes } from '@/features/leads/forms/LeadNotes';
import { LeadFormActions } from '@/features/leads/forms/LeadFormActions';
import { InfoAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TagsInput } from '@/components/ui/TagsInput';
import { Input } from '@/components/ui/Input';
import { usersMock } from '@/mocks/users.mock';
import { ROUTES, buildEditCompanyPath } from '@/lib/constants/routes.constants';
import type { Company } from '@/types/company.types';

const DEFAULT_VALUES: CompanyFormValues = {
  name: '',
  industry: '',
  description: '',
  logoUrl: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  country: '',
  zipCode: '',
  vatNumber: '',
  employeeCount: '' as unknown as number,
  estimatedRevenue: '' as unknown as number,
  size: undefined,
  status: 'active',
  source: undefined,
  ownerId: usersMock[0]?.id ?? '',
  notes: '',
  tags: [],
};

export interface CompanyFormProps {
  company?: Company;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const { draftValues, hasDraft, saveDraft, clearDraft, dismissDraftPrompt } =
    useCompanyDraft<CompanyFormValues>();

  const isEditMode = company !== undefined;

  const editDefaults: CompanyFormValues = company
    ? {
        name: company.name,
        industry: company.industry ?? '',
        description: company.description ?? '',
        logoUrl: company.logoUrl ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        website: company.website ?? '',
        address: company.address ?? '',
        city: company.city ?? '',
        country: company.country ?? '',
        zipCode: company.zipCode ?? '',
        vatNumber: company.vatNumber ?? '',
        employeeCount: company.employeeCount ?? ('' as unknown as number),
        estimatedRevenue: company.estimatedRevenue ?? ('' as unknown as number),
        size: company.size,
        status: company.status,
        source: company.source,
        ownerId: company.ownerId,
        notes: company.notes ?? '',
        tags: company.tags ?? [],
      }
    : DEFAULT_VALUES;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: editDefaults,
  });

  const blocker = useUnsavedChangesGuard(isDirty);
  const watchedValues = useWatch({ control });

  // Autosave brouillon uniquement en mode création
  useEffect(() => {
    if (!isEditMode && isDirty) {
      saveDraft(watchedValues as CompanyFormValues);
    }
  }, [watchedValues, isEditMode, isDirty, saveDraft]);

  const [showDraftBanner, setShowDraftBanner] = useState(
    !isEditMode && hasDraft,
  );

  function handleRestoreDraft() {
    if (draftValues) {
      reset(draftValues);
    }
    setShowDraftBanner(false);
    dismissDraftPrompt();
  }

  function handleDismissDraft() {
    clearDraft();
    setShowDraftBanner(false);
  }

  async function onSubmit(values: CompanyFormValues) {
    try {
      const nowIso = new Date().toISOString();

      if (isEditMode && company) {
        await updateCompany(company.id, {
          name: values.name,
          industry: values.industry || undefined,
          description: values.description || undefined,
          logoUrl: values.logoUrl || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          website: values.website || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          country: values.country || undefined,
          zipCode: values.zipCode || undefined,
          vatNumber: values.vatNumber || undefined,
          employeeCount: typeof values.employeeCount === 'number' ? values.employeeCount : undefined,
          estimatedRevenue: typeof values.estimatedRevenue === 'number' ? values.estimatedRevenue : undefined,
          size: values.size || undefined,
          status: values.status,
          source: values.source || undefined,
          ownerId: values.ownerId,
          notes: values.notes || undefined,
          tags: values.tags,
          updatedAt: nowIso,
        });
        success(`${values.name} a été mis à jour.`);
        navigate(buildEditCompanyPath(company.id));
      } else {
        const newCompany = await createCompany({
          name: values.name,
          industry: values.industry || undefined,
          description: values.description || undefined,
          logoUrl: values.logoUrl || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          website: values.website || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          country: values.country || undefined,
          zipCode: values.zipCode || undefined,
          vatNumber: values.vatNumber || undefined,
          employeeCount: typeof values.employeeCount === 'number' ? values.employeeCount : undefined,
          estimatedRevenue: typeof values.estimatedRevenue === 'number' ? values.estimatedRevenue : undefined,
          size: values.size || undefined,
          status: values.status,
          source: values.source || undefined,
          ownerId: values.ownerId,
          notes: values.notes || undefined,
          tags: values.tags ?? [],
          linkedContactIds: [],
          linkedLeadIds: [],
          linkedOpportunityIds: [],
          createdAt: nowIso,
          updatedAt: nowIso,
        });

        clearDraft();
        success(`${newCompany.name} a été ajoutée à vos entreprises.`);
        navigate(ROUTES.COMPANIES);
      }
    } catch {
      notifyError(
        isEditMode
          ? 'La modification a échoué. Veuillez réessayer.'
          : 'La création a échoué. Veuillez réessayer.',
      );
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <AnimatePresence>
          {showDraftBanner ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <InfoAlert title="Brouillon trouvé">
                <div className="flex flex-col gap-3">
                  <p>
                    Un brouillon non terminé a été trouvé. Voulez-vous le
                    restaurer ?
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleRestoreDraft}>
                      Restaurer le brouillon
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDismissDraft}
                    >
                      Ignorer
                    </Button>
                  </div>
                </div>
              </InfoAlert>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <LeadSection
          title="Informations générales"
          description="Dénomination et secteur de l'entreprise."
        >
          <LeadTextField
            label="Nom de l'entreprise"
            required
            placeholder="LeadPro CRM"
            error={errors.name?.message}
            {...register('name')}
          />
          <LeadTextField
            label="Secteur"
            placeholder="Technologies"
            error={errors.industry?.message}
            {...register('industry')}
          />
          <div className="tablet:col-span-2">
            <LeadTextField
              label="Description"
              placeholder="Brève présentation de l'entreprise..."
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
          <LeadTextField
            label="URL du logo"
            placeholder="https://exemple.com/logo.png"
            error={errors.logoUrl?.message}
            {...register('logoUrl')}
          />
        </LeadSection>

        <LeadSection title="Coordonnées" delay={0.05}>
          <LeadTextField
            label="Email"
            type="email"
            placeholder="contact@entreprise.ma"
            error={errors.email?.message}
            {...register('email')}
          />
          <LeadPhoneInput
            label="Téléphone"
            placeholder="+212 5 22 00 00 00"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="tablet:col-span-2">
            <LeadTextField
              label="Site web"
              placeholder="https://www.exemple.com"
              error={errors.website?.message}
              {...register('website')}
            />
          </div>
        </LeadSection>

        <LeadSection title="Adresse" delay={0.1}>
          <LeadTextField
            label="Adresse"
            placeholder="123 Boulevard Mohammed V"
            error={errors.address?.message}
            {...register('address')}
          />
          <LeadTextField
            label="Ville"
            placeholder="Casablanca"
            error={errors.city?.message}
            {...register('city')}
          />
          <LeadTextField
            label="Pays"
            placeholder="Maroc"
            error={errors.country?.message}
            {...register('country')}
          />
          <LeadTextField
            label="Code postal"
            placeholder="20000"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </LeadSection>

        <LeadSection title="Informations commerciales" delay={0.15}>
          <LeadSelect
            label="Taille de l'entreprise"
            error={errors.size?.message}
            {...register('size')}
          >
            <option value="">Sélectionnez une taille</option>
            <option value="1-10">1-10 employés</option>
            <option value="11-50">11-50 employés</option>
            <option value="51-200">51-200 employés</option>
            <option value="201-500">201-500 employés</option>
            <option value="501-1000">501-1000 employés</option>
            <option value="1000+">1000+ employés</option>
          </LeadSelect>
          <LeadTextField
            label="Nombre d'employés"
            type="number"
            placeholder="50"
            error={errors.employeeCount?.message}
            {...register('employeeCount', { valueAsNumber: true })}
          />
          <LeadTextField
            label="Chiffre d'affaires estimé (MAD)"
            type="number"
            placeholder="5000000"
            error={errors.estimatedRevenue?.message}
            {...register('estimatedRevenue', { valueAsNumber: true })}
          />
          <LeadTextField
            label="N° TVA"
            placeholder="FR12345678901"
            error={errors.vatNumber?.message}
            {...register('vatNumber')}
          />
          <LeadSelect
            label="Statut"
            required
            error={errors.status?.message}
            {...register('status')}
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="lead">Prospect</option>
          </LeadSelect>
          <LeadSelect
            label="Source"
            error={errors.source?.message}
            {...register('source')}
          >
            <option value="">Sélectionnez une source</option>
            <option value="website">Site web</option>
            <option value="referral">Recommandation</option>
            <option value="social_media">Réseaux sociaux</option>
            <option value="cold_call">Appel sortant</option>
            <option value="email_campaign">Campagne email</option>
            <option value="event">Salon / Événement</option>
            <option value="partner">Partenaire</option>
            <option value="other">Autre</option>
          </LeadSelect>
          <LeadSelect
            label="Responsable"
            required
            error={errors.ownerId?.message}
            {...register('ownerId')}
          >
            {usersMock.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </LeadSelect>
        </LeadSection>

        <LeadSection title="Notes et Tags" delay={0.2}>
          <div className="tablet:col-span-2">
            <LeadNotes
              label="Notes"
              placeholder="Contexte, objectifs, points clés..."
              description="Toute information utile pour le suivi de cette entreprise."
              maxLength={500}
              error={errors.notes?.message}
              {...register('notes')}
            />
          </div>
          <div className="tablet:col-span-2">
            <label className="mb-1.5 block text-label text-text-primary">
              Tags
            </label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TagsInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  aria-label="Tags de l'entreprise"
                />
              )}
            />
          </div>
        </LeadSection>

        <LeadFormActions
          onCancel={() => navigate(ROUTES.COMPANIES)}
          isSubmitting={isSubmitting}
        />
      </form>

      <Modal
        isOpen={blocker.state === 'blocked'}
        onClose={() => {
          if (blocker.state === 'blocked') blocker.reset();
        }}
        title="Modifications non enregistrées"
      >
        <p className="text-body text-text-secondary">
          Vous avez des modifications non enregistrées. Voulez-vous vraiment
          quitter cette page ?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (blocker.state === 'blocked') blocker.reset();
            }}
          >
            Continuer l'édition
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (blocker.state === 'blocked') blocker.proceed();
            }}
          >
            Quitter sans enregistrer
          </Button>
        </div>
      </Modal>
    </>
  );
}

