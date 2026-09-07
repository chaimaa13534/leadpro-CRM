import type { FieldValues, Resolver, ResolverResult } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Adaptateur Zod → React Hook Form, écrit à la main plutôt que d'ajouter
 * la dépendance `@hookform/resolvers` (le brief du Jour 6 demande
 * explicitement de n'installer aucune nouvelle bibliothèque). Suffisant
 * pour des schémas "plats" comme les nôtres (login, mot de passe…) —
 * pas de gestion de chemins imbriqués profonds, non nécessaire ici.
 *
 * Le cast final vers `ResolverResult` est nécessaire car les types
 * internes de React Hook Form (`FieldErrors`, `ResolverResult`) sont des
 * types conditionnels profonds pensés pour être déduits automatiquement
 * depuis un schéma de champs concret, pas construits génériquement comme
 * ici — le comportement runtime reste strictement conforme au contrat
 * `Resolver` (mêmes clés `values`/`errors` que la résolution officielle).
 *
 * Utilisation identique à `zodResolver` de la librairie officielle :
 * `useForm({ resolver: zodResolver(loginSchema) })`.
 */
export function zodResolver<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      } as unknown as ResolverResult<TFieldValues>;
    }

    const errors: Record<string, { type: string; message: string }> = {};

    for (const issue of result.error.issues) {
      const fieldName = issue.path.join('.');
      if (!errors[fieldName]) {
        errors[fieldName] = { type: issue.code, message: issue.message };
      }
    }

    return {
      values: {},
      errors,
    } as unknown as ResolverResult<TFieldValues>;
  };
}
