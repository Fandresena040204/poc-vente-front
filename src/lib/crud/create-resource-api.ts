import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'

export type ListParams = {
  page: number
  pageSize: number
  ordering?: string
  search?: string
  /** Paramètres de filtre spécifiques à la ressource (déjà sérialisés en chaîne, ex: `'draft,validated'` pour un filtre multi-valeurs). */
  filters?: Record<string, string | undefined>
}

export type ResourceApi<TEntity, TForm> = {
  /** Ramène TOUTE la ressource (boucle sur la pagination DRF) — pour les
   * besoins qui ont besoin de l'ensemble complet (options de select,
   * résolution id -> libellé), pas pour l'affichage d'une liste paginée. */
  fetchAll: () => Promise<TEntity[]>
  /** Une page de résultats, filtrée/triée côté serveur — pour l'affichage
   * d'une liste paginée (`ResourceDataTable`). */
  fetchList: (params: ListParams) => Promise<PaginatedResponse<TEntity>>
  create: (payload: TForm) => Promise<TEntity>
  update: (id: string, payload: TForm) => Promise<TEntity>
  delete: (id: string) => Promise<void>
}

type CreateResourceApiOptions<TForm> = {
  /** Transforme les valeurs du formulaire avant l'envoi (ex: reformater des lignes imbriquées). */
  toPayload?: (values: TForm) => unknown
}

/**
 * Boucle sur la pagination DRF (`next`) pour ramener toutes les pages
 * d'un coup. Exportée séparément de `createResourceApi` pour les
 * ressources en lecture seule ou partielles (ex: Users, sans create/
 * update/delete côté API) qui n'ont pas besoin du reste de la fabrique.
 */
export async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const results: T[] = []
  let url: string | null = endpoint

  while (url) {
    const { data }: { data: PaginatedResponse<T> } =
      await apiClient.get<PaginatedResponse<T>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

/**
 * Fabrique les 4 appels CRUD standard pour une ressource REST DRF
 * (`GET /`, `POST /`, `PATCH /{id}/`, `DELETE /{id}/`), en gérant la
 * pagination DRF pour `fetchAll`. Les actions custom (ex: valider/annuler)
 * ne passent pas par cette fabrique : ce sont de simples fonctions à côté
 * dans le `api.ts` de la ressource.
 */
export function createResourceApi<TEntity, TForm>(
  endpoint: string,
  options: CreateResourceApiOptions<TForm> = {}
): ResourceApi<TEntity, TForm> {
  const toPayload = options.toPayload ?? ((values: TForm) => values)

  return {
    fetchAll: () => fetchAllPages<TEntity>(endpoint),

    fetchList: async (params: ListParams) => {
      const { data } = await apiClient.get<PaginatedResponse<TEntity>>(endpoint, {
        params: {
          page: params.page,
          page_size: params.pageSize,
          ordering: params.ordering,
          search: params.search,
          ...params.filters,
        },
      })
      return data
    },

    create: async (payload: TForm) => {
      const { data } = await apiClient.post<TEntity>(endpoint, toPayload(payload))
      return data
    },

    update: async (id: string, payload: TForm) => {
      const { data } = await apiClient.patch<TEntity>(
        `${endpoint}${id}/`,
        toPayload(payload)
      )
      return data
    },

    delete: async (id: string) => {
      await apiClient.delete(`${endpoint}${id}/`)
    },
  }
}
