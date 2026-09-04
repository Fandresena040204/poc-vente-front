import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  annulerVente,
  createVente,
  deleteVente,
  fetchAllVentes,
  updateVente,
  validerVente,
} from './api'
import { type VenteForm } from './data/schema'

const VENTES_QUERY_KEY = ['ventes']

export function useVentes() {
  return useQuery({
    queryKey: VENTES_QUERY_KEY,
    queryFn: fetchAllVentes,
  })
}

export function useCreateVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: VenteForm) => createVente(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTES_QUERY_KEY })
      toast.success('Vente created.')
    },
  })
}

export function useUpdateVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: VenteForm }) =>
      updateVente(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTES_QUERY_KEY })
      toast.success('Vente updated.')
    },
  })
}

export function useDeleteVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTES_QUERY_KEY })
      toast.success('Vente deleted.')
    },
  })
}

export function useValiderVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => validerVente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTES_QUERY_KEY })
      toast.success('Vente validated.')
    },
  })
}

export function useAnnulerVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => annulerVente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENTES_QUERY_KEY })
      toast.success('Vente cancelled.')
    },
  })
}
