import {
  createActionHook,
  createResourceHooks,
} from '@/lib/crud/create-resource-hooks'
import { annulerVente, validerVente, ventesApi } from './api'

const VENTES_QUERY_KEY = ['ventes']

export const {
  useList: useVentes,
  useListPage: useVentesPage,
  useCreate: useCreateVente,
  useUpdate: useUpdateVente,
  useDelete: useDeleteVente,
} = createResourceHooks(VENTES_QUERY_KEY, ventesApi, { entityLabel: 'Vente' })

export const useValiderVente = createActionHook(
  VENTES_QUERY_KEY,
  validerVente,
  'Vente validated.'
)

export const useAnnulerVente = createActionHook(
  VENTES_QUERY_KEY,
  annulerVente,
  'Vente cancelled.'
)
