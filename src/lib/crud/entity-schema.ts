import { z } from 'zod'

/**
 * Champs communs à toute ressource métier (id texte + timestamps serveur).
 * Usage : `z.object({ ...entityBase, name: z.string(), ... })`.
 */
export const entityBase = {
  id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
}

/**
 * Champ "montant décimal" tel que renvoyé par les DecimalField DRF
 * (string, ex: "19.99") — regex partagée par tous les champs prix/quantité.
 */
export function decimalString(options?: { required?: string; invalid?: string }) {
  return z
    .string()
    .min(1, options?.required ?? 'This field is required.')
    .regex(
      /^\d+(\.\d{1,2})?$/,
      options?.invalid ?? 'Enter a valid amount (e.g. 19.99).'
    )
}
