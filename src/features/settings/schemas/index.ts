/* ═════════════════════════════════════════════════════════════════════
   Settings & Administration — Schemas (barrel)
   ═════════════════════════════════════════════════════════════════════ */

export {
  generalPreferencesSchema,
  type GeneralPreferencesFormValues,
} from '@/features/settings/schemas/general.schema';

export {
  profileSchema,
  type ProfileFormValues,
} from '@/features/settings/schemas/profile.schema';

export {
  organizationSchema,
  type OrganizationFormValues,
} from '@/features/settings/schemas/organization.schema';

export {
  passwordSchema,
  getPasswordRequirements,
  countPasswordStrengths,
  type PasswordFormValues,
} from '@/features/settings/schemas/password.schema';

export {
  inviteMemberSchema,
  type InviteMemberFormValues,
} from '@/features/settings/schemas/invite.schema';

