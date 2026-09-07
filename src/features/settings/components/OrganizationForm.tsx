/* ═════════════════════════════════════════════════════════════════════
   Settings — OrganizationForm
   Formulaire de l’organisation avec React Hook Form + Zod.
   ═════════════════════════════════════════════════════════════════════ */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Upload, X } from 'lucide-react';
import { zodResolver } from '@/lib/zod-resolver';
import {
  organizationSchema,
  type OrganizationFormValues,
} from '@/features/settings/schemas';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import type { CompanySize, Organization } from '@/features/settings/types';

interface OrganizationFormProps {
  organization: Organization;
  onSave: (values: OrganizationFormValues) => Promise<void> | void;
  saving?: boolean;
}

const companySizeOptions: { label: string; value: CompanySize }[] = [
  { label: '1–10 employés', value: '1-10' },
  { label: '11–50 employés', value: '11-50' },
  { label: '51–200 employés', value: '51-200' },
  { label: '201–500 employés', value: '201-500' },
  { label: '501–1000 employés', value: '501-1000' },
  { label: '1000+ employés', value: '1000+' },
];

/* ═══════════════════════════════════════════════════════ */
export function OrganizationForm({
  organization,
  onSave,
  saving = false,
}: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization.name,
      industry: organization.industry ?? '',
      website: organization.website ?? '',
      phone: organization.phone ?? '',
      email: organization.email ?? '',
      country: organization.country ?? '',
      city: organization.city ?? '',
      address: organization.address ?? '',
      postalCode: organization.postalCode ?? '',
      companySize: organization.companySize,
      taxId: organization.taxId ?? '',
      description: organization.description ?? '',
    },
  });

  const handleLogoUpload = useMemo(
    () => () => {
      // Simulation d’upload de logo — aucune requête externe.
      return undefined;
    },
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6">
      <SettingsSection
        title="Logo"
        description="Le logo de votre organisation, affiché dans le CRM."
      >
        <SettingsCard>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLogoUpload}
                  leadingIcon={<Upload className="h-3.5 w-3.5" />}
                >
                  Upload logo
                </Button>
                <Button type="button" variant="ghost" size="sm" leadingIcon={<X className="h-3.5 w-3.5" />}>
                  Remove
                </Button>
              </div>
              <p className="text-[11px] text-text-tertiary">
                PNG, JPG ou SVG — 2 Mo max.
              </p>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Informations"
        description="Coordonnées et identité de votre organisation."
      >
        <SettingsCard>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Input
              label="Organization name"
              placeholder="LeadPro CRM"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Industry"
              placeholder="SaaS · CRM"
              error={errors.industry?.message}
              {...register('industry')}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://leadpro.io"
              error={errors.website?.message}
              {...register('website')}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+33 1 84 88 40 40"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="contact@leadpro.io"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="Company size"
              placeholder="Select a size"
              options={companySizeOptions}
              error={errors.companySize?.message}
              {...register('companySize')}
            />
            <Input
              label="Country"
              placeholder="France"
              error={errors.country?.message}
              {...register('country')}
            />
            <Input
              label="City"
              placeholder="Paris"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Address"
              placeholder="12 rue de la Boétie"
              error={errors.address?.message}
              {...register('address')}
            />
            <Input
              label="Postal code"
              placeholder="75008"
              error={errors.postalCode?.message}
              {...register('postalCode')}
            />
            <Input
              label="Tax ID"
              placeholder="FR 12 345 678 901"
              error={errors.taxId?.message}
              {...register('taxId')}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Description"
        description="Une description courte de votre activité."
      >
        <SettingsCard>
          <div className="p-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="organization-description"
                className="text-[12px] font-medium text-text-secondary"
              >
                Description
              </label>
              <textarea
                id="organization-description"
                rows={3}
                placeholder="Décrivez votre organisation…"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled outline-none transition-all duration-150 hover:border-border-hover focus:border-accent focus:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]"
                aria-invalid={!!errors.description}
                {...register('description')}
              />
              {errors.description ? (
                <p className="text-[12px] font-medium text-danger-400" role="alert">
                  {errors.description.message}
                </p>
              ) : null}
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export default OrganizationForm;

