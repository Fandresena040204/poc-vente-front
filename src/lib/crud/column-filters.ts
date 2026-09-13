import { type ColumnFiltersState } from '@tanstack/react-table'

/**
 * Lit la valeur courante d'un filtre de colonne par son id — évite de
 * répéter `columnFilters.find((f) => f.id === ...)?.value` dans chaque
 * `*-table.tsx` qui construit ses paramètres de requête backend à partir de
 * l'état de filtre de la table.
 */
export function getColumnFilterValue<T>(
  columnFilters: ColumnFiltersState,
  columnId: string
): T | undefined {
  return columnFilters.find((filter) => filter.id === columnId)?.value as
    | T
    | undefined
}

/** Construit le paramètre `ordering` DRF (`-champ` pour desc) depuis le premier tri actif. */
export function buildOrdering(
  sorting: { id: string; desc: boolean }[]
): string | undefined {
  const [sort] = sorting
  if (!sort) return undefined
  return sort.desc ? `-${sort.id}` : sort.id
}
