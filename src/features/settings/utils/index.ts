/* ═════════════════════════════════════════════════════════════════════
   Settings & Administration — Utils (barrel)
   ═════════════════════════════════════════════════════════════════════ */

export * from '@/features/settings/utils/settings-storage';

export {
  computePasswordStrength,
  REQUIREMENT_LABELS,
  type PasswordStrength,
  type PasswordStrengthLabel,
} from '@/features/settings/utils/password-utils';

