import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Vente } from '../data/schema'
import { VentesDeleteDialog } from './ventes-delete-dialog'

const mutateDelete = vi.fn()

vi.mock('../hooks', () => ({
  useDeleteVente: () => ({ mutate: mutateDelete, isPending: false }),
}))

const MOCK_VENTE: Vente = {
  id: 'VNT00001',
  customer: 'CUS00001',
  status: 'draft',
  total: '99.80',
  lines: [],
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

describe('VentesDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with title, description and disabled delete button', async () => {
    const { getByRole, getByText } = await render(
      <VentesDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_VENTE} />
    )

    const title = getByRole('heading', { level: 2, name: /Delete Vente/i })
    const desc = getByText(
      new RegExp(`Are you sure you want to delete ${MOCK_VENTE.id}?`, 'i')
    )
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the ID input matches exactly', async () => {
    const { getByRole, getByPlaceholder } = await render(
      <VentesDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_VENTE} />
    )

    const idInput = getByPlaceholder(/Enter vente ID/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await userEvent.fill(idInput, 'wrong-id')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(idInput, MOCK_VENTE.id)
    await expect.element(deleteButton).toBeEnabled()
  })

  it('calls the delete mutation and closes the dialog on success', async () => {
    mutateDelete.mockImplementation(
      (_id: string, { onSuccess }: { onSuccess: () => void }) => onSuccess()
    )
    const onOpenChange = vi.fn()
    const { getByRole, getByPlaceholder } = await render(
      <VentesDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_VENTE}
      />
    )

    await userEvent.fill(getByPlaceholder(/Enter vente ID/i), MOCK_VENTE.id)
    await userEvent.click(getByRole('button', { name: /^Delete$/i }))

    expect(mutateDelete).toHaveBeenCalledWith(
      MOCK_VENTE.id,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
