import { useState } from 'react'

/**
 * État d'un dialog de suppression pour une ressource. Remplace le trio
 * provider+dialogs+delete-dialog par ressource : Add/Edit sont des pages
 * (navigation), il ne reste que Delete à gérer, donc un simple état local
 * suffit — plus besoin de React Context.
 */
export function useDeleteDialogState<T>() {
  const [open, setOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<T | null>(null)

  function requestDelete(row: T) {
    setCurrentRow(row)
    setOpen(true)
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      // laisse l'animation de fermeture se jouer avant de vider la ligne
      setTimeout(() => setCurrentRow(null), 500)
    }
  }

  return { open, currentRow, requestDelete, onOpenChange }
}
