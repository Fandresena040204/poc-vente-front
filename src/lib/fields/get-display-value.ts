import { type FieldDescriptor, type FieldOption } from './field-descriptor'

/**
 * Valeur "lisible" d'un champ pour un affichage hors formulaire (liste,
 * détail, récapitulatif) : résout un `select` en libellé plutôt que la
 * valeur brute, formate les dates.
 */
export function getDisplayValue<TRow extends Record<string, unknown>>(
  descriptor: FieldDescriptor<TRow>,
  row: TRow,
  resolvedOptions?: FieldOption[]
): string {
  const raw = row[descriptor.name]
  if (raw === null || raw === undefined || raw === '') return ''

  if (descriptor.type === 'select') {
    const options =
      resolvedOptions ??
      (Array.isArray(descriptor.options) ? descriptor.options : [])
    return options.find((option) => option.value === raw)?.label ?? String(raw)
  }

  if (descriptor.type === 'date') {
    return new Date(raw as string).toLocaleDateString()
  }

  if (descriptor.type === 'datetime') {
    return new Date(raw as string).toLocaleString()
  }

  return String(raw)
}
