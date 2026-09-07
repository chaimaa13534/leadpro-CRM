import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Target,
  Building2,
  Users,
  DollarSign,
  FileText,
  Tag,
  Sparkles,
  RotateCcw,
  X as XIcon,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { zodResolver } from '@/lib/zod-resolver';
import {
  opportunitySchema,
  type OpportunityFormValues,
} from '@/schemas/opportunity.schema';
import { createOpportunity, updateOpportunity } from '@/services/opportunity.service';
import { useNotifications } from '@/hooks/useNotifications';
import { useOpportunityDraft } from '@/features/opportunities/hooks/useOpportunityDraft';
import { useUnsavedChangesGuard } from '@/features/contacts/hooks/useUnsavedChangesGuard';
import { LeadSection } from '@/features/leads/forms/LeadSection';
import { LeadTextField } from '@/features/leads/forms/LeadTextField';
import { LeadSelect } from '@/features/leads/forms/LeadSelect';
import { LeadNotes } from '@/features/leads/forms/LeadNotes';
import { LeadFormActions } from '@/features/leads/forms/LeadFormActions';
import { cn } from '@/lib/cn';
import { TagsInput } from '@/components/ui/TagsInput';
import { usersMock } from '@/mocks/users.mock';
import { companiesMock } from '@/mocks/companies.mock';
import { contactsMock } from '@/mocks/contacts.mock';
import { ROUTES, buildEditOpportunityPath } from '@/lib/constants/routes.constants';
import type { Opportunity } from '@/types/opportunity.types';

const DEFAULT_VALUES: OpportunityFormValues = {
  name: '',
  companyId: '',
  contactId: '',
  ownerId: usersMock[0]?.id ?? '',
  amount: 0,
  currency: 'MAD',
  probability: 0,
  pipeline: 'Sales Pipeline',
  stage: 'prospecting',
  priority: 'medium',
  status: 'active',
  source: 'inbound',
  expectedCloseDate: '',
  description: '',
  notes: '',
  tags: [],
};

const PIPELINE_OPTIONS = ['Sales Pipeline', 'Enterprise Pipeline', 'Partner Pipeline'];
const STAGE_OPTIONS = [
  { value: 'prospecting', label: 'Prospection' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposition' },
  { value: 'negotiation', label: 'Négociation' },
  { value: 'contract_sent', label: 'Contrat envoyé' },
  { value: 'closed_won', label: 'Gagnée' },
  { value: 'closed_lost', label: 'Perdue' },
];
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'critical', label: 'Critique' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'En attente' },
  { value: 'won', label: 'Gagnée' },
  { value: 'lost', label: 'Perdue' },
  { value: 'abandoned', label: 'Abandonnée' },
];
const CURRENCY_OPTIONS = [
  { value: 'MAD', label: 'MAD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CAD', label: 'CAD' },
];
const SOURCE_OPTIONS = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'referral', label: 'Recommandation' },
  { value: 'website', label: 'Site web' },
  { value: 'social_media', label: 'Réseaux sociaux' },
  { value: 'event', label: 'Événement' },
  { value: 'cold_call', label: 'Appel sortant' },
  { value: 'email_campaign', label: 'Campagne email' },
  { value: 'partner', label: 'Partenaire' },
  { value: 'existing_customer', label: 'Client existant' },
  { value: 'other', label: 'Autre' },
];

export interface OpportunityFormProps {
  opportunity?: Opportunity;
}

export function OpportunityForm({ opportunity }: OpportunityFormProps) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const { draftValues, hasDraft, saveDraft, clearDraft, dismissDraftPrompt } =
    useOpportunityDraft<OpportunityFormValues>();

  const isEditMode = opportunity !== undefined;

  const editDefaults: OpportunityFormValues = opportunity
    ? {
        name: opportunity.name,
        companyId: opportunity.companyId ?? '',
        contactId: opportunity.contactId ?? '',
        ownerId: opportunity.ownerId,
        amount: opportunity.amount,
        currency: opportunity.currency,
        probability: opportunity.probability,
        pipeline: opportunity.pipeline,
        stage: opportunity.stage,
        priority: opportunity.priority,
        status: opportunity.status,
        source: opportunity.source,
        expectedCloseDate: opportunity.expectedCloseDate ?? '',
        description: opportunity.description ?? '',
        notes: opportunity.notes ?? '',
        tags: opportunity.tags ?? [],
      }
    : DEFAULT_VALUES;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: editDefaults,
  });

  const blocker = useUnsavedChangesGuard(isDirty);
  const watchedValues = useWatch({ control });

  // Autosave brouillon uniquement en mode création
  useEffect(() => {
    if (!isEditMode && isDirty) {
      saveDraft(watchedValues as OpportunityFormValues);
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

  async function onSubmit(values: OpportunityFormValues) {
    try {
      const nowIso = new Date().toISOString();
      const company = companiesMock.find((c) => c.id === values.companyId);
      const contact = contactsMock.find((c) => c.id === values.contactId);

      if (isEditMode && opportunity) {
        await updateOpportunity(opportunity.id, {
          name: values.name,
          companyId: values.companyId,
          companyName: company?.name ?? '',
          contactId: values.contactId,
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : '',
          ownerId: values.ownerId,
          amount: values.amount,
          currency: values.currency,
          probability: values.probability,
          pipeline: values.pipeline,
          stage: values.stage,
          priority: values.priority,
          status: values.status,
          source: values.source,
          expectedCloseDate: values.expectedCloseDate || undefined,
          description: values.description || undefined,
          notes: values.notes || undefined,
          tags: values.tags ?? [],
          updatedAt: nowIso,
        });
        success(`L'opportunité "${values.name}" a été mise à jour.`);
        navigate(buildEditOpportunityPath(opportunity.id));
      } else {
        const newOpportunity = await createOpportunity({
          name: values.name,
          companyId: values.companyId,
          companyName: company?.name ?? '',
          contactId: values.contactId,
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : '',
          ownerId: values.ownerId,
          amount: values.amount,
          currency: values.currency,
          probability: values.probability,
          pipeline: values.pipeline,
          stage: values.stage,
          priority: values.priority,
          status: values.status,
          source: values.source,
          expectedCloseDate: values.expectedCloseDate || undefined,
          description: values.description || undefined,
          notes: values.notes || undefined,
          tags: values.tags ?? [],
          history: [],
          documents: [],
          activities: [],
          createdAt: nowIso,
          updatedAt: nowIso,
        });

        clearDraft();
        success(`L'opportunité "${newOpportunity.name}" a été créée.`);
        navigate(ROUTES.OPPORTUNITIES);
      }
    } catch {
      notifyError(
        isEditMode
          ? 'La modification de l\'opportunité a échoué. Veuillez réessayer.'
          : 'La création de l\'opportunité a échoué. Veuillez réessayer.',
      );
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-8"
      >
        {/* ── Draft Banner ── */}
        <AnimatePresence>
          {showDraftBanner ? (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 via-accent/3 to-transparent backdrop-blur-sm">
                <div className="flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary">
                      Brouillon trouvé
                    </p>
                    <p className="mt-0.5 text-[13px] text-text-tertiary">
                      Un brouillon non terminé a été trouvé. Voulez-vous le restaurer ?
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <motion.button
                      type="button"
                      onClick={handleRestoreDraft}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5',
                        'text-[12px] font-medium text-white',
                        'bg-accent shadow-sm',
                        'hover:bg-accent-hover',
                        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20',
                      )}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Restaurer
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleDismissDraft}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5',
                        'text-[12px] font-medium text-text-secondary',
                        'border border-border bg-surface',
                        'hover:border-border-hover hover:text-text-primary',
                        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20',
                      )}
                    >
                      <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Ignorer
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── General Information ── */}
        <LeadSection
          title="Informations générales"
          description="Décrivez l'opportunité commerciale et ses caractéristiques principales."
          icon={Target}
        >
          <LeadTextField
            label="Nom de l'opportunité"
            required
            placeholder="Déploiement CRM Atlassian"
            error={errors.name?.message}
            {...register('name')}
          />
          <LeadSelect
            label="Pipeline"
            required
            error={errors.pipeline?.message}
            {...register('pipeline')}
          >
            {PIPELINE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Étape"
            required
            error={errors.stage?.message}
            {...register('stage')}
          >
            {STAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Priorité"
            required
            error={errors.priority?.message}
            {...register('priority')}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Statut"
            required
            error={errors.status?.message}
            {...register('status')}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Source"
            required
            error={errors.source?.message}
            {...register('source')}
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </LeadSelect>
        </LeadSection>

        {/* ── Relations ── */}
        <LeadSection
          title="Relations"
          description="Associez l'opportunité à une entreprise, un contact et un commercial."
          icon={Building2}
          delay={0.05}
        >
          <LeadSelect
            label="Entreprise"
            required
            error={errors.companyId?.message}
            {...register('companyId')}
          >
            <option value="">Sélectionnez une entreprise</option>
            {companiesMock.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Contact"
            required
            error={errors.contactId?.message}
            {...register('contactId')}
          >
            <option value="">Sélectionnez un contact</option>
            {contactsMock.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.firstName} {contact.lastName}
              </option>
            ))}
          </LeadSelect>
          <LeadSelect
            label="Commercial"
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

        {/* ── Value ── */}
        <LeadSection
          title="Valeur"
          description="Montant, devise, probabilité et date de clôture estimée."
          icon={DollarSign}
          delay={0.1}
        >
          <LeadTextField
            label="Montant"
            type="number"
            required
            placeholder="50000"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <LeadSelect
            label="Devise"
            required
            error={errors.currency?.message}
            {...register('currency')}
          >
            {CURRENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </LeadSelect>
          <LeadTextField
            label="Probabilité (%)"
            type="number"
            required
            placeholder="50"
            min={0}
            max={100}
            error={errors.probability?.message}
            {...register('probability', { valueAsNumber: true })}
          />
          <LeadTextField
            label="Date de clôture estimée"
            type="date"
            error={errors.expectedCloseDate?.message}
            {...register('expectedCloseDate')}
          />
        </LeadSection>

        {/* ── Description ── */}
        <LeadSection
          title="Description"
          description="Contexte, objectifs et périmètre de l'opportunité."
          icon={FileText}
          delay={0.15}
        >
          <div className="sm:col-span-2">
            <LeadNotes
              label="Description"
              placeholder="Contexte, objectifs, périmètre de l'opportunité..."
              description="Décrivez l'opportunité en détail."
              maxLength={2000}
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </LeadSection>

        {/* ── Notes & Tags ── */}
        <LeadSection
          title="Notes & Tags"
          description="Informations internes et mots-clés pour le suivi."
          icon={Tag}
          delay={0.2}
        >
          <div className="sm:col-span-2">
            <LeadNotes
              label="Notes"
              placeholder="Notes internes, prochaines actions..."
              description="Toute information utile pour le suivi."
              maxLength={1000}
              error={errors.notes?.message}
              {...register('notes')}
            />
          </div>
          <div className="sm:col-span-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium leading-none tracking-tight text-text-primary">
                Tags
              </label>
              <p className="text-[12px] leading-relaxed text-text-tertiary">
                Mots-clés pour catégoriser l'opportunité.
              </p>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    aria-label="Tags de l'opportunité"
                  />
                )}
              />
            </div>
          </div>
        </LeadSection>

        {/* ── Form Actions ── */}
        <LeadFormActions
          onCancel={() => navigate(ROUTES.OPPORTUNITIES)}
          isSubmitting={isSubmitting}
          submitLabel={isEditMode ? 'Mettre à jour l\'opportunité' : 'Créer l\'opportunité'}
        />
      </form>

      {/* ── Unsaved Changes Modal ── */}
      <AnimatePresence>
        {blocker.state === 'blocked' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-overlay"
              onClick={() => {
                if (blocker.state === 'blocked') blocker.reset();
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="unsaved-modal-title"
            >
              <div className="p-6">
                {/* Icon */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-warning-50 text-warning-600 dark:bg-warning-500/10">
                  <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Title & Description */}
                <div className="mt-4 text-center">
                  <h2
                    id="unsaved-modal-title"
                    className="text-[16px] font-semibold text-text-primary"
                  >
                    Modifications non enregistrées
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-tertiary">
                    Vous avez des modifications non enregistrées. Voulez-vous
                    vraiment quitter cette page ?
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (blocker.state === 'blocked') blocker.reset();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5',
                      'text-[13px] font-medium text-text-primary',
                      'border border-border bg-surface',
                      'hover:border-border-hover hover:bg-surface-hover',
                      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20',
                      'sm:flex-1',
                    )}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Continuer l'édition
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (blocker.state === 'blocked') blocker.proceed();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5',
                      'text-[13px] font-semibold text-white',
                      'bg-danger-600 shadow-sm',
                      'hover:bg-danger-700',
                      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger-500/30',
                      'sm:flex-1',
                    )}
                  >
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                    Quitter sans enregistrer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

