import {
  type QueryKey,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { type ListParams, type ResourceApi } from './create-resource-api'

type CreateResourceHooksOptions = {
  /** Utilisé dans les messages de toast : "Product created.", "Product deleted." */
  entityLabel: string
}

/**
 * Fabrique les hooks TanStack Query standard (liste/create/update/delete)
 * pour une ressource, à partir de l'objet retourné par `createResourceApi`.
 * Chaque mutation invalide `queryKey` et affiche un toast au succès.
 */
export function createResourceHooks<TEntity, TForm>(
  queryKey: QueryKey,
  api: ResourceApi<TEntity, TForm>,
  { entityLabel }: CreateResourceHooksOptions
) {
  function useList() {
    return useQuery({ queryKey, queryFn: api.fetchAll })
  }

  /**
   * Une page de résultats filtrée/triée côté serveur — pour l'affichage
   * d'une liste paginée (`ResourceDataTable`), à la différence de `useList`
   * qui ramène tout (options de select, résolution id -> libellé).
   * `placeholderData: keepPreviousData` évite un flash "0 résultat" pendant
   * qu'une nouvelle page/filtre se charge.
   */
  function useListPage(params: ListParams) {
    // `api` est stable (créé une fois au niveau module par `createResourceApi`),
    // pas besoin de l'inclure dans la queryKey.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    return useQuery({
      queryKey: [...queryKey, 'page', params],
      queryFn: () => api.fetchList(params),
      placeholderData: keepPreviousData,
    })
  }

  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: TForm) => api.create(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
        toast.success(`${entityLabel} created.`)
      },
    })
  }

  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: TForm }) =>
        api.update(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
        toast.success(`${entityLabel} updated.`)
      },
    })
  }

  function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => api.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
        toast.success(`${entityLabel} deleted.`)
      },
    })
  }

  return { useList, useListPage, useCreate, useUpdate, useDelete }
}

/**
 * Pour une action custom (ex: `valider`/`annuler` sur Vente) : même
 * mécanique d'invalidation + toast que les hooks standard, sans imposer de
 * forme particulière à `fn`.
 */
export function createActionHook<TArg>(
  queryKey: QueryKey,
  fn: (arg: TArg) => Promise<unknown>,
  successMessage: string
) {
  return function useAction() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: fn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
        toast.success(successMessage)
      },
    })
  }
}
