import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Vente } from '../data/schema'

type VentesDialogType = 'delete'

type VentesContextType = {
  open: VentesDialogType | null
  setOpen: (str: VentesDialogType | null) => void
  currentRow: Vente | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Vente | null>>
}

const VentesContext = React.createContext<VentesContextType | null>(null)

export function VentesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<VentesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Vente | null>(null)

  return (
    <VentesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VentesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVentesContext = () => {
  const context = React.useContext(VentesContext)

  if (!context) {
    throw new Error('useVentesContext has to be used within <VentesContext>')
  }

  return context
}
