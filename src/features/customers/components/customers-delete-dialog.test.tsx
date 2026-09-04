import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Customer } from '../data/schema'
import { CustomersDeleteDialog } from './customers-delete-dialog'

const mutateDelete = vi.fn()

vi.mock('../hooks', () => ({
  useDeleteCustomer: () => ({ mutate: mutateDelete, isPending: false }),
}))

const MOCK_CUSTOMER: Customer = {
  id: 'CUS00001',
  name: 'Acme Corp',
  email: 'contact@acme.test',
  phone: '0123456789',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

describe('CustomersDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with title, description and disabled delete button', async () => {
    const { getByRole, getByText } = await render(
      <CustomersDeleteDialog
        open
        onOpenChange={vi.fn()}
        currentRow={MOCK_CUSTOMER}
      />
    )

    const title = getByRole('heading', { level: 2, name: /Delete Customer/i })
    const desc = getByText(
      new RegExp(`Are you sure you want to delete ${MOCK_CUSTOMER.name}?`, 'i')
    )
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the name input matches exactly', async () => {
    const { getByRole, getByPlaceholder } = await render(
      <CustomersDeleteDialog
        open
        onOpenChange={vi.fn()}
        currentRow={MOCK_CUSTOMER}
      />
    )

    const nameInput = getByPlaceholder(/Enter customer name/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await userEvent.fill(nameInput, 'wrong name')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(nameInput, MOCK_CUSTOMER.name)
    await expect.element(deleteButton).toBeEnabled()
  })

  it('calls the delete mutation and closes the dialog on success', async () => {
    mutateDelete.mockImplementation(
      (_id: string, { onSuccess }: { onSuccess: () => void }) => onSuccess()
    )
    const onOpenChange = vi.fn()
    const { getByRole, getByPlaceholder } = await render(
      <CustomersDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_CUSTOMER}
      />
    )

    await userEvent.fill(
      getByPlaceholder(/Enter customer name/i),
      MOCK_CUSTOMER.name
    )
    await userEvent.click(getByRole('button', { name: /^Delete$/i }))

    expect(mutateDelete).toHaveBeenCalledWith(
      MOCK_CUSTOMER.id,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes the dialog when cancel is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <CustomersDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_CUSTOMER}
      />
    )

    await userEvent.click(getByRole('button', { name: /Cancel/i }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(mutateDelete).not.toHaveBeenCalled()
  })
})
