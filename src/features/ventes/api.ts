import { apiClient } from '@/lib/api-client'
import { createResourceApi } from '@/lib/crud/create-resource-api'
import { type Vente, type VenteForm } from './data/schema'

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

export const ventesApi = createResourceApi<Vente, VenteForm>('/api/ventes/', {
  toPayload,
})

export async function validerVente(id: string): Promise<Vente> {
  const { data } = await apiClient.post<Vente>(`/api/ventes/${id}/valider/`)
  return data
}

export async function annulerVente(id: string): Promise<Vente> {
  const { data } = await apiClient.post<Vente>(`/api/ventes/${id}/annuler/`)
  return data
}
