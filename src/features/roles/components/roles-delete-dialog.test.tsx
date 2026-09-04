import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Role } from '../data/schema'
import { RolesDeleteDialog } from './roles-delete-dialog'

const mutateDelete = vi.fn()

vi.mock('../hooks', () => ({
  useDeleteRole: () => ({ mutate: mutateDelete, isPending: false }),
}))

const MOCK_ROLE: Role = { id: 'ROL00003', name: 'manager', permissions: [] }

describe('RolesDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with title, description and disabled delete button', async () => {
    const { getByRole, getByText } = await render(
      <RolesDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_ROLE} />
    )

    const title = getByRole('heading', { level: 2, name: /Delete Role/i })
    const desc = getByText(new RegExp(MOCK_ROLE.name, 'i'))
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the name matches exactly', async () => {
    const { getByRole, getByPlaceholder } = await render(
      <RolesDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_ROLE} />
    )

    const nameInput = getByPlaceholder(/Enter role name/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await userEvent.fill(nameInput, 'wrong')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(nameInput, MOCK_ROLE.name)
    await expect.element(deleteButton).toBeEnabled()
  })

  it('calls the delete mutation and closes the dialog on success', async () => {
    mutateDelete.mockImplementation(
      (_id: string, { onSuccess }: { onSuccess: () => void }) => onSuccess()
    )
    const onOpenChange = vi.fn()
    const { getByRole, getByPlaceholder } = await render(
      <RolesDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_ROLE}
      />
    )

    await userEvent.fill(getByPlaceholder(/Enter role name/i), MOCK_ROLE.name)
    await userEvent.click(getByRole('button', { name: /^Delete$/i }))

    expect(mutateDelete).toHaveBeenCalledWith(
      MOCK_ROLE.id,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
