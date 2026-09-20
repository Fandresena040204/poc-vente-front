import { useEffect, useRef, useState } from 'react'
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { type FieldDescriptor, type FieldOption } from './field-descriptor'

const SEARCH_DEBOUNCE_MS = 300

function buildDepsRecord(names: string[] | undefined, values: unknown) {
  if (!names || names.length === 0) return {}
  const arr = Array.isArray(values) ? values : [values]
  return Object.fromEntries(names.map((name, i) => [name, arr[i]]))
}

/**
 * Plomberie partagée par tout champ ayant `dependsOn` ou `search` :
 * - si `options` est une fonction, la ré-exécute à chaque changement d'une
 *   dépendance (résolution des options d'un select dépendant) ;
 * - si `search` est fourni, résout les options par recherche serveur
 *   tapée par l'utilisateur (debounce), pour une ressource trop volumineuse
 *   pour être chargée en une fois — mutuellement exclusif avec `options`/
 *   `dependsOn` sur le même champ ;
 * - si `compute` est fourni, recalcule et applique la valeur du champ à
 *   chaque changement d'une dépendance ;
 * - expose `handleSelect` pour appliquer `fillsFields` à la sélection ;
 * - si le champ a une valeur initiale (ex: `defaultValue` dynamique d'une
 *   nouvelle ligne, ou une valeur déjà persistée en édition) et
 *   `fillsFields`, applique la cascade une seule fois au montage dès que
 *   les options correspondantes sont résolues — mais uniquement sur les
 *   champs cibles encore vides, pour ne jamais écraser une valeur déjà
 *   persistée (ex: en édition, `unit_price` sauvegardé à l'époque reste
 *   prioritaire sur le prix par défaut actuel du produit).
 */
export function useFieldDependencies<TValues extends FieldValues>(
  descriptor: FieldDescriptor<TValues>,
  form: UseFormReturn<TValues>
) {
  const { control, setValue } = form
  const depNames = (descriptor.dependsOn ?? []) as Path<TValues>[]
  const depValues = useWatch({ control, name: depNames })
  const depsKey = JSON.stringify(depValues)

  // Options statiques : dérivées directement au rendu, pas d'état local.
  const staticOptions = Array.isArray(descriptor.options)
    ? descriptor.options
    : undefined

  const [asyncOptions, setAsyncOptions] = useState<FieldOption[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  useEffect(() => {
    if (descriptor.search) return
    if (!descriptor.options || Array.isArray(descriptor.options)) return
    const resolver = descriptor.options
    const deps = buildDepsRecord(descriptor.dependsOn, depValues)
    let cancelled = false
    // Pattern standard de fetch-in-effect (React docs "Fetching data") :
    // signaler le chargement au déclenchement de l'effet, pas seulement à
    // la résolution — nécessairement synchrone ici.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingOptions(true)
    Promise.resolve(resolver(deps))
      .then((resolved) => {
        if (!cancelled) setAsyncOptions(resolved)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOptions(false)
      })
    return () => {
      cancelled = true
    }
    // depsKey résume depValues (comparaison stable sans dépendre de l'identité du tableau)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptor.options, descriptor.search, depsKey])

  // --- Recherche serveur (descriptor.search) ---
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchOptions, setSearchOptions] = useState<FieldOption[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [initialOption, setInitialOption] = useState<FieldOption | undefined>()
  const hasResolvedInitial = useRef(false)
  // Valeur choisie via `handleSelect` (sélection normale ou création
  // rapide) : la conserver indépendamment de `searchOptions` — sinon,
  // dès qu'une nouvelle recherche renvoie une liste qui ne contient plus
  // la valeur choisie, le combobox perdrait son libellé affiché (bascule
  // sur le placeholder alors qu'une valeur est bien sélectionnée).
  const [selectedOption, setSelectedOption] = useState<FieldOption | undefined>()

  useEffect(() => {
    if (!descriptor.search) return
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [descriptor.search, searchQuery])

  useEffect(() => {
    if (!descriptor.search) return
    const { fetchOptions } = descriptor.search
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSearching(true)
    fetchOptions(debouncedQuery)
      .then((resolved) => {
        if (!cancelled) setSearchOptions(resolved)
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false)
      })
    return () => {
      cancelled = true
    }
  }, [descriptor.search, debouncedQuery])

  useEffect(() => {
    if (!descriptor.search?.resolveInitial || hasResolvedInitial.current) return
    const currentValue = form.getValues(descriptor.name as Path<TValues>)
    if (currentValue === undefined || currentValue === null || currentValue === '') return
    hasResolvedInitial.current = true
    descriptor.search
      .resolveInitial(currentValue as string)
      .then((resolved) => setInitialOption(resolved))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptor.search])

  const pinnedOption = selectedOption ?? initialOption
  const options = descriptor.search
    ? pinnedOption && !searchOptions.some((o) => o.value === pinnedOption.value)
      ? [pinnedOption, ...searchOptions]
      : searchOptions
    : (staticOptions ?? asyncOptions)

  const hasAppliedMountCascade = useRef(false)

  useEffect(() => {
    if (hasAppliedMountCascade.current) return
    if (!descriptor.fillsFields || isLoadingOptions || options.length === 0) return
    const currentValue = form.getValues(descriptor.name as Path<TValues>)
    if (currentValue === undefined || currentValue === null || currentValue === '') return
    const matched = options.find((option) => option.value === currentValue)
    if (!matched) return
    hasAppliedMountCascade.current = true
    const patch = descriptor.fillsFields(matched)
    Object.entries(patch).forEach(([key, value]) => {
      // Ne remplit que les champs encore vides : en édition, la valeur déjà
      // persistée (ex: `unit_price` sauvegardé à l'époque) reste prioritaire
      // sur la valeur par défaut recalculée depuis les options actuelles.
      const existing = form.getValues(key as Path<TValues>)
      if (existing === undefined || existing === null || existing === '') {
        setValue(key as Path<TValues>, value as TValues[Path<TValues>])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, isLoadingOptions])

  useEffect(() => {
    if (!descriptor.compute) return
    const deps = buildDepsRecord(descriptor.dependsOn, depValues)
    setValue(
      descriptor.name as Path<TValues>,
      descriptor.compute(deps) as TValues[Path<TValues>]
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptor.compute, depsKey])

  function handleSelect(option: FieldOption, onChange: (value: string) => void) {
    onChange(option.value)
    if (descriptor.search) setSelectedOption(option)
    if (!descriptor.fillsFields) return
    const patch = descriptor.fillsFields(option)
    Object.entries(patch).forEach(([key, value]) => {
      setValue(key as Path<TValues>, value as TValues[Path<TValues>])
    })
  }

  return {
    options,
    isLoadingOptions: descriptor.search ? isSearching : isLoadingOptions,
    handleSelect,
    onSearchChange: descriptor.search ? setSearchQuery : undefined,
  }
}
