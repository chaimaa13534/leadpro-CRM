import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@/lib/zod-resolver';
import {
  contactSchema,
  type ContactFormValues,
} from '@/schemas/contact.schema';
import { createContact, updateContact } from '@/services/contact.service';
import { useNotifications } from '@/hooks/useNotifications';
import { useContactDraft } from '@/features/contacts/hooks/useContactDraft';
import { useUnsavedChangesGuard } from '@/features/contacts/hooks/useUnsavedChangesGuard';
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
import { ROUTES, buildEditContactPath } from '@/lib/constants/routes.constants';
import type { Contact } from '@/types/contact.types';

const DEFAULT_VALUES: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobile: '',
  jobTitle: '',
  company: '',
  linkedIn: '',
  website: '',
  address: '',
  city: '',
  country: '',
  status: 'active',
  ownerId: usersMock[0]?.id ?? '',
  notes: '',
  tags: [],
};

export interface ContactFormProps {
  contact?: Contact;
}

/**
 * Formulaire de création/édition d'un contact.
 * - Mode création : `contact` est undefined → appel à `createContact`
 * - Mode édition : `contact` est défini → valeurs pré-remplies + `updateContact`
 * - Autosave (brouillon localStorage) en mode création uniquement
 * - Détection des modifications non enregistrées
 * - Réutilise les composants de formulaire Lead (Section, TextField, Select…)
 */
export function ContactForm({ contact }: ContactFormProps) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const { draftValues, hasDraft, saveDraft, clearDraft, dismissDraftPrompt } =
    useContactDraft<ContactFormValues>();

  const isEditMode = contact !== undefined;

  const editDefaults: ContactFormValues = contact
    ? {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone ?? '',
        mobile: contact.mobile ?? '',
        jobTitle: contact.jobTitle ?? '',
        company: contact.company ?? '',
        linkedIn: contact.linkedIn ?? '',
        website: contact.website ?? '',
        address: contact.address ?? '',
        city: contact.city ?? '',
        country: contact.country ?? '',
        status: contact.status,
        ownerId: contact.ownerId,
        notes: contact.notes ?? '',
        tags: contact.tags ?? [],
      }
    : DEFAULT_VALUES;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: editDefaults,
  });

  const blocker = useUnsavedChangesGuard(isDirty);
  const watchedValues = useWatch({ control });

  // Autosave brouillon uniquement en mode création
  useEffect(() => {
    if (!isEditMode && isDirty) {
      saveDraft(watchedValues as ContactFormValues);
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

  async function onSubmit(values: ContactFormValues) {
    try {
      const nowIso = new Date().toISOString();

      if (isEditMode && contact) {
        await updateContact(contact.id, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone || undefined,
          mobile: values.mobile || undefined,
          jobTitle: values.jobTitle || undefined,
          company: values.company || undefined,
          linkedIn: values.linkedIn || undefined,
          website: values.website || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          country: values.country || undefined,
          status: values.status,
          ownerId: values.ownerId,
          notes: values.notes || undefined,
          tags: values.tags,
          updatedAt: nowIso,
        });
        success(
          `${values.firstName} ${values.lastName} a été mis à jour.`,
        );
        navigate(buildEditContactPath(contact.id));
      } else {
        const newContact = await createContact({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone || undefined,
          mobile: values.mobile || undefined,
          jobTitle: values.jobTitle || undefined,
          company: values.company || undefined,
          linkedIn: values.linkedIn || undefined,
          website: values.website || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          country: values.country || undefined,
          status: values.status,
          ownerId: values.ownerId,
          notes: values.notes || undefined,
          tags: values.tags,
          createdAt: nowIso,
          updatedAt: nowIso,
        });

        clearDraft();
        success(
          `${newContact.firstName} ${newContact.lastName} a été ajouté à vos contacts.`,
        );
        navigate(ROUTES.CONTACTS);
      }
    } catch {
      notifyError(
        isEditMode
          ? 'La modification du contact a échoué. Veuillez réessayer.'
          : 'La création du contact a échoué. Veuillez réessayer.',
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
          <LeadPhoneInput
            label="Mobile"
            placeholder="+212 6 12 34 56 78"
            error={errors.mobile?.message}
            {...register('mobile')}
          />
          <LeadTextField
            label="Fonction"
            placeholder="Directeur Général"
            error={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
        </LeadSection>

        <LeadSection title="Entreprise" delay={0.05}>
          <LeadTextField
            label="Nom de l'entreprise"
            placeholder="Atlas Textile"
            error={errors.company?.message}
            {...register('company')}
          />
          <LeadTextField
            label="LinkedIn"
            placeholder="https://linkedin.com/in/nour-bennani"
            error={errors.linkedIn?.message}
            {...register('linkedIn')}
          />
          <div className="tablet:col-span-2">
            <LeadTextField
              label="Site web"
              placeholder="https://exemple.com"
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
        </LeadSection>

        <LeadSection title="Organisation" delay={0.15}>
          <LeadSelect
            label="Statut"
            required
            error={errors.status?.message}
            {...register('status')}
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="vip">VIP</option>
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

        <LeadSection title="Notes" delay={0.2}>
          <div className="tablet:col-span-2">
            <LeadNotes
              label="Notes"
              placeholder="Contexte, besoins exprimés, prochaine étape..."
              description="Toute information utile pour la suite de la relation."
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
                  aria-label="Tags du contact"
                />
              )}
            />
          </div>
        </LeadSection>

        <LeadFormActions
          onCancel={() => navigate(ROUTES.CONTACTS)}
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

