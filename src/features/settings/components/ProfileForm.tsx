/* ═════════════════════════════════════════════════════════════════════
   Settings — ProfileForm
   Formulaire du profil utilisateur avec React Hook Form + Zod.
   Inclut la simulation d’upload d’avatar (aucun upload externe).
   ═════════════════════════════════════════════════════════════════════ */

import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, ImagePlus, X } from 'lucide-react';
import { zodResolver } from '@/lib/zod-resolver';
import { profileSchema, type ProfileFormValues } from '@/features/settings/schemas';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { departmentsMock } from '@/features/settings/mocks';
import type { UserProfile } from '@/features/settings/types';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (values: ProfileFormValues) => Promise<void> | void;
  saving?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function ProfileForm({ profile, onSave, saving = false }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone ?? '',
      jobTitle: profile.jobTitle ?? '',
      department: profile.department ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      website: profile.website ?? '',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    profile.avatarUrl,
  );
  const [avatarName, setAvatarName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Simulation d’upload : lecture locale uniquement, aucune requête.
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setAvatarName(file.name);
    },
    [],
  );

  const handleRemoveAvatar = useCallback(() => {
    setAvatarPreview(undefined);
    setAvatarName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const departmentOptions = useMemo(
    () => departmentsMock.map((department) => ({ label: department, value: department })),
    [],
  );

  const handleCancel = useCallback(() => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone ?? '',
      jobTitle: profile.jobTitle ?? '',
      department: profile.department ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      website: profile.website ?? '',
    });
    setAvatarPreview(profile.avatarUrl);
    setAvatarName(null);
  }, [profile, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6">
      <SettingsSection
        title="Avatar"
        description="Une photo de profil aide votre équipe à vous reconnaître."
      >
        <SettingsCard>
          <SettingsGroup divided={false}>
            <SettingsRow title="Photo de profil">
              <div className="flex items-center gap-3">
                <Avatar
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                  src={avatarPreview}
                  size="xl"
                />
                <div className="flex flex-col gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    id="profile-avatar-input"
                    onChange={handleAvatarChange}
                    aria-label="Choisir une photo de profil"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      leadingIcon={<Camera className="h-3.5 w-3.5" />}
                    >
                      Change avatar
                    </Button>
                    {avatarPreview ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        leadingIcon={<X className="h-3.5 w-3.5" />}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  {avatarName ? (
                    <p className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                      <ImagePlus className="h-3 w-3" />
                      {avatarName}
                    </p>
                  ) : null}
                </div>
              </div>
            </SettingsRow>
          </SettingsGroup>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Informations personnelles"
        description="Ces informations apparaissent sur votre profil et dans le CRM."
      >
        <SettingsCard>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Input
              label="First name"
              placeholder="Alex"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last name"
              placeholder="Martin"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="alex.martin@leadpro.io"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Job title"
              placeholder="Sales Manager"
              error={errors.jobTitle?.message}
              {...register('jobTitle')}
            />
            <Select
              label="Department"
              placeholder="Select a department"
              options={departmentOptions}
              error={errors.department?.message}
              {...register('department')}
            />
            <Input
              label="Location"
              placeholder="Paris, France"
              error={errors.location?.message}
              {...register('location')}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://leadpro.io"
              error={errors.website?.message}
              {...register('website')}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="À propos"
        description="Une courte présentation visible par votre équipe."
      >
        <SettingsCard>
          <div className="p-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-bio"
                className="text-[12px] font-medium text-text-secondary"
              >
                Bio
              </label>
              <textarea
                id="profile-bio"
                rows={4}
                placeholder="Parlez de votre rôle, vos objectifs…"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled outline-none transition-all duration-150 hover:border-border-hover focus:border-accent focus:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]"
                aria-invalid={!!errors.bio}
                {...register('bio')}
              />
              {errors.bio ? (
                <p className="text-[12px] font-medium text-danger-400" role="alert">
                  {errors.bio.message}
                </p>
              ) : null}
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={!isDirty && !avatarName}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;

