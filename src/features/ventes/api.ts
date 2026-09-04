import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'
import { type Vente, type VenteForm } from './data/schema'

export async function fetchAllVentes(): Promise<Vente[]> {
  const results: Vente[] = []
  let url: string | null = '/api/ventes/'

  while (url) {
    const { data }: { data: PaginatedResponse<Vente> } =
      await apiClient.get<PaginatedResponse<Vente>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

function toPayload(values: VenteForm) {
  return {
    customer: values.customer,
    lines: values.lines.map((line) => ({
      ...(line.id ? { id: line.id } : {}),
      product: line.product,
      quantity: line.quantity,
      unit_price: line.unit_price,
    })),
  }
}

export async function createVente(values: VenteForm): Promise<Vente> {
  const { data } = await apiClient.post<Vente>(
    '/api/ventes/',
    toPayload(values)
  )
  return data
}

export async function updateVente(
  id: string,
  values: VenteForm
): Promise<Vente> {
  const { data } = await apiClient.patch<Vente>(
    `/api/ventes/${id}/`,
    toPayload(values)
  )
  return data
}

export async function deleteVente(id: string): Promise<void> {
  await apiClient.delete(`/api/ventes/${id}/`)
}

export async function validerVente(id: string): Promise<Vente> {
  const { data } = await apiClient.post<Vente>(`/api/ventes/${id}/valider/`)
  return data
}

export async function annulerVente(id: string): Promise<Vente> {
  const { data } = await apiClient.post<Vente>(`/api/ventes/${id}/annuler/`)
  return data
}
