import { type ReactNode } from 'react'

/** `data` porte l'enregistrement source complet (ex: le Product entier), pour que `fillsFields` puisse lire d'autres champs que `label`/`value`. */
export type FieldOption = { label: string; value: string; data?: unknown }

export type FieldType = 'text' | 'number' | 'date' | 'datetime' | 'select'

/**
 * Décrit un champ une seule fois, réutilisable en formulaire (via
 * `RenderFormField`) et en colonne de liste (via `renderColumn`). La
 * complexité (dépendances, remplissage en cascade, valeur calculée) est
 * portée par le champ lui-même plutôt que par un moteur de formulaire
 * générique — voir GUIDE_DEVELOPPEUR.md pour le raisonnement complet.
 */
export type FieldDescriptor<TValues = Record<string, unknown>> = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  /** Passé tel quel à l'attribut HTML `autocomplete` (ex: 'off'). */
  autoComplete?: string

  /**
   * Options pour `type: 'select'`. Une fonction reçoit les valeurs
   * actuelles des champs listés dans `dependsOn` (utile pour un select
   * dont les choix dépendent d'un autre champ).
   */
  options?:
    | FieldOption[]
    | ((deps: Record<string, unknown>) => Promise<FieldOption[]> | FieldOption[])

  /** Noms des autres champs dont dépend `options` et/ou `compute`. */
  dependsOn?: string[]

  /**
   * Appelé à la sélection d'une option (`type: 'select'`) : le patch
   * retourné est appliqué aux autres champs du formulaire (ex: sélectionner
   * un produit remplit `unit_price` avec son prix par défaut). Les clés
   * sont des chemins react-hook-form (`Path<TValues>`, dot-notation y
   * compris pour les tableaux, ex: `lines.0.unit_price`) — `Record<string,
   * unknown>` plutôt que `Partial<TValues>` car un chemin imbriqué n'est
   * pas une clé de premier niveau de `TValues`.
   */
  fillsFields?: (selected: FieldOption) => Record<string, unknown>

  /**
   * Valeur calculée à partir de `dependsOn` (ex: un sous-total). Le champ
   * reste un champ de formulaire normal mais sa valeur est recalculée
   * automatiquement à chaque changement d'une dépendance.
   */
  compute?: (deps: Record<string, unknown>) => unknown

  /** Rendu en liste : enveloppe la valeur affichée dans un lien. */
  clickable?: boolean
  linkTo?: (row: TValues) => { to: string; params?: Record<string, string> }

  /**
   * Rendu personnalisé en colonne de liste (ex: Badge coloré, LongText
   * tronqué) — prend le dessus sur le rendu texte par défaut de
   * `renderColumn`. `clickable`/`linkTo` sont ignorés si `render` est
   * fourni (le rendu custom décide de tout).
   */
  render?: (row: TValues) => ReactNode

  /**
   * Bascule un champ `type: 'select'` en recherche serveur plutôt qu'une
   * liste d'options chargée en une fois — pour un select adossé à une
   * ressource potentiellement volumineuse (ex: choisir un client parmi
   * plusieurs centaines). Mutuellement exclusif avec `options`/
   * `dependsOn` sur le même champ.
   */
  search?: {
    /** Appelée à la frappe (debounce ~300ms) : renvoie les options correspondantes (déjà limitées côté backend, ex: `fetchList({ search: query })`). */
    fetchOptions: (query: string) => Promise<FieldOption[]>
    /** Résout le libellé de la valeur déjà présente au montage (édition), sans dépendre de la première page de résultats. */
    resolveInitial?: (value: string) => Promise<FieldOption | undefined>
  }

  /**
   * Bouton "+" à côté d'un `type: 'select'`, ouvrant un dialog qui rend
   * le formulaire de création existant de la ressource liée — la valeur
   * créée est sélectionnée automatiquement à la fermeture.
   */
  quickCreate?: {
    title: string
    /** Rend le formulaire de création de la ressource liée (jamais de `currentRow`, toujours une création). */
    renderForm: (props: {
      onSuccess: (created: unknown) => void
      onCancel: () => void
    }) => ReactNode
    /** Construit l'option à sélectionner à partir de l'entité tout juste créée. */
    toOption: (created: unknown) => FieldOption
  }
}
