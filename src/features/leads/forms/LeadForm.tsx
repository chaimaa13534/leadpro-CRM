import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@/lib/zod-resolver';
import {
  newLeadSchema,
  type NewLeadFormValues,
} from '@/schemas/newLead.schema';
import { createLead } from '@/services/lead.service';
import { useNotifications } from '@/hooks/useNotifications';
import { useLeadDraft } from '@/features/leads/hooks/useLeadDraft';
import { useUnsavedChangesGuard } from '@/features/leads/hooks/useUnsavedChangesGuard';
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
import { usersMock } from '@/mocks/users.mock';
import { industriesMock, countriesMock } from '@/features/leads/mocks';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
} from '@/lib/constants/statuses.constants';
import {
  COMPANY_SIZE_OPTIONS,
  COMPANY_SIZES,
} from '@/lib/constants/company.constants';
import { ROUTES } from '@/lib/constants/routes.constants';

const DEFAULT_VALUES: NewLeadFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  companyName: '',
  companyWebsite: '',
  industry: '',
  companySize: undefined,
  source: 'website',
  status: 'new',
  priority: 'medium',
  ownerId: usersMock[0]?.id ?? '',
  estimatedValue: undefined,
  conversionProbability: undefined,
  country: '',
  city: '',
  address: '',
  notes: '',
  tags: [],
};

/**
 * Orchestre tout le formulaire "Nouveau Lead" : validation (Zod),
 * brouillon automatique (`localStorage`), confirmation avant de quitter
 * avec des modifications non enregistrées, et soumission simulée.
 *
 * Le payload envoyé à `createLead` (déjà prêt côté service depuis le
 * Jour 2 — fabrique CRUD générique) est un `Omit<Lead, 'id'>` complet :
 * remplacer la simulation par un vrai `POST /leads` ne demandera aucun
 * changement ici, seulement dans `services/lead.service.ts`.
 */
export function LeadForm() {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const { draftValues, hasDraft, saveDraft, clearDraft, dismissDraftPrompt } =
    useLeadDraft<NewLeadFormValues>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<NewLeadFormValues>({
    resolver: zodResolver(newLeadSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const blocker = useUnsavedChangesGuard(isDirty);
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (isDirty) {
      saveDraft(watchedValues as NewLeadFormValues);
    }
  }, [watchedValues, isDirty, saveDraft]);

  const [showDraftBanner, setShowDraftBanner] = useState(hasDraft);

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

  async function onSubmit(values: NewLeadFormValues) {
    try {
      const nowIso = new Date().toISOString();
      const lead = await createLead({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        jobTitle: values.jobTitle || undefined,
        companyName: values.companyName,
        companyWebsite: values.companyWebsite || undefined,
        industry: values.industry || undefined,
        companySize: values.companySize,
        status: values.status,
        source: values.source,
        priority: values.priority,
        estimatedValue: values.estimatedValue,
        conversionProbability: values.conversionProbability,
        ownerId: values.ownerId,
        country: values.country || undefined,
        city: values.city || undefined,
        address: values.address || undefined,
        notes: values.notes || undefined,
        tags: values.tags,
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      clearDraft();
      success(`${lead.firstName} ${lead.lastName} a été ajouté à vos leads.`);
      navigate(ROUTES.LEADS);
    } catch {
      notifyError('La création du lead a échoué. Veuillez réessayer.');
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
          title="Informations personnelles"
          description="Coordonnées principales du contact."
        >
          <LeadTextField
            label="Prénom"
            required
            placeholder="Nour"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <LeadTextField
            label="Nom"
            required
            placeholder="Bennani"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <LeadTextField
            label="Email"
            type="email"
            required
            placeholder="nour.bennani@entreprise.ma"
            error={errors.email?.message}
            {...register('email')}
          />
          <LeadPhoneInput
            label="Téléphone"
            placeholder="+212 6 12 34 56 78"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <LeadTextField
            label="Fonction"
            placeholder="Directeur Général"
            description="Le poste occupé chez le prospect."
            error={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
        </LeadSection>

        <LeadSection title="Entreprise" delay={0.05}>
          <LeadTextField
            label="Nom de l'entreprise"
            required
            placeholder="Atlas Textile"
            error={errors.companyName?.message}
            {...register('companyName')}
          />
          <LeadTextField
            label="Site web"
            placeholder="https://exemple.com"
            error={errors.companyWebsite?.message}
            {...register('companyWebsite')}
          />
          <LeadSelect
            label="Secteur d'activité"
            error={errors.industry?.message}
            {...register('industry')}
          >
            <option value="">Sélectionner un secteur</option>
            {industriesMock.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Taille de l'entreprise"
            error={errors.companySize?.message}
            {...register('companySize')}
          >
            <option value="">Sélectionner une taille</option>
            {COMPANY_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {COMPANY_SIZES[size].label}
              </option>
            ))}
          </LeadSelect>
        </LeadSection>

        <LeadSection title="Informations commerciales" delay={0.1}>
          <LeadSelect
            label="Source"
            required
            error={errors.source?.message}
            {...register('source')}
          >
            {Object.entries(LEAD_SOURCES).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Statut"
            required
            error={errors.status?.message}
            {...register('status')}
          >
            {Object.entries(LEAD_STATUSES).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Priorité"
            required
            error={errors.priority?.message}
            {...register('priority')}
          >
            {Object.entries(LEAD_PRIORITIES).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Responsable commercial"
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
          <LeadTextField
            label="Valeur estimée (MAD)"
            type="number"
            min={0}
            placeholder="50000"
            error={errors.estimatedValue?.message}
            {...register('estimatedValue', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          />
          <LeadTextField
            label="Probabilité de conversion (%)"
            type="number"
            min={0}
            max={100}
            placeholder="50"
            error={errors.conversionProbability?.message}
            {...register('conversionProbability', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          />
        </LeadSection>

        <LeadSection title="Adresse" delay={0.15}>
          <LeadSelect
            label="Pays"
            error={errors.country?.message}
            {...register('country')}
          >
            <option value="">Sélectionner un pays</option>
            {countriesMock.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </LeadSelect>
          <LeadTextField
            label="Ville"
            placeholder="Casablanca"
            error={errors.city?.message}
            {...register('city')}
          />
          <div className="tablet:col-span-2">
            <LeadTextField
              label="Adresse"
              placeholder="123 Boulevard Mohammed V"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>
        </LeadSection>

        <LeadSection title="Notes" delay={0.2}>
          <div className="tablet:col-span-2">
            <LeadNotes
              label="Notes"
              placeholder="Contexte, besoins exprimés, prochaine étape..."
              description="Toute information utile pour la suite de la relation commerciale."
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
                  aria-label="Tags du lead"
                />
              )}
            />
          </div>
        </LeadSection>

        <LeadFormActions
          onCancel={() => navigate(ROUTES.LEADS)}
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
