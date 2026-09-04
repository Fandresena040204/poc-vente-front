import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Customer } from '../data/schema'
import { CustomersActionDialog } from './customers-action-dialog'

const mutateAsyncCreate = vi.fn()
const mutateAsyncUpdate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateCustomer: () => ({
    mutateAsync: mutateAsyncCreate,
    isPending: false,
  }),
  useUpdateCustomer: () => ({
    mutateAsync: mutateAsyncUpdate,
    isPending: false,
  }),
}))

const MOCK_CUSTOMER: Customer = {
  id: 'CUS00001',
  name: 'Acme Corp',
  email: 'contact@acme.test',
  phone: '0123456789',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

async function fillFields(
  screen: RenderResult,
  { name, email, phone }: { name?: string; email?: string; phone?: string }
) {
  if (name !== undefined) {
    await userEvent.fill(screen.getByLabelText(/^Name$/i), name)
  }
  if (email !== undefined) {
    await userEvent.fill(screen.getByLabelText(/^Email$/i), email)
  }
  if (phone !== undefined) {
    await userEvent.fill(screen.getByLabelText(/^Phone$/i), phone)
  }
}

describe('CustomersActionDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
    mutateAsyncUpdate.mockResolvedValue(undefined)
  })

  describe('add customer', () => {
    it('renders title and description', async () => {
      const { getByRole, getByText } = await render(
        <CustomersActionDialog open onOpenChange={vi.fn()} />
      )

      await expect
        .element(getByRole('heading', { level: 2, name: /Add New Customer/i }))
        .toBeInTheDocument()
      await expect
        .element(getByText(/Create a new customer here\./i))
        .toBeInTheDocument()
    })

    it('shows a validation message when name is empty', async () => {
      const { getByRole, getByText } = await render(
        <CustomersActionDialog open onOpenChange={vi.fn()} />
      )

      await userEvent.click(getByRole('button', { name: /Save changes/i }))

      await expect
        .element(getByText('Name is required.'))
        .toBeInTheDocument()
      expect(mutateAsyncCreate).not.toHaveBeenCalled()
    })

    it('creates the customer and closes the dialog on success', async () => {
      const onOpenChange = vi.fn()
      const screen = await render(
        <CustomersActionDialog open onOpenChange={onOpenChange} />
      )

      await fillFields(screen, {
        name: 'Acme Corp',
        email: 'contact@acme.test',
        phone: '0123456789',
      })
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
      expect(mutateAsyncCreate).toHaveBeenCalledWith({
        name: 'Acme Corp',
        email: 'contact@acme.test',
        phone: '0123456789',
      })
      await vi.waitFor(() =>
        expect(onOpenChange).toHaveBeenCalledWith(false)
      )
    })
  })

  describe('edit customer', () => {
    it('renders title and prefilled fields', async () => {
      const screen = await render(
        <CustomersActionDialog
          open
          onOpenChange={vi.fn()}
          currentRow={MOCK_CUSTOMER}
        />
      )

      await expect
        .element(
          screen.getByRole('heading', { level: 2, name: /Edit Customer/i })
        )
        .toBeInTheDocument()
      await expect
        .element(screen.getByLabelText(/^Name$/i))
        .toHaveValue(MOCK_CUSTOMER.name)
    })

    it('updates the customer and closes the dialog on success', async () => {
      const onOpenChange = vi.fn()
      const screen = await render(
        <CustomersActionDialog
          open
          onOpenChange={onOpenChange}
          currentRow={MOCK_CUSTOMER}
        />
      )

      await fillFields(screen, { phone: '0699887766' })
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncUpdate).toHaveBeenCalledOnce())
      expect(mutateAsyncUpdate).toHaveBeenCalledWith({
        id: MOCK_CUSTOMER.id,
        payload: {
          name: MOCK_CUSTOMER.name,
          email: MOCK_CUSTOMER.email,
          phone: '0699887766',
        },
      })
      await vi.waitFor(() =>
        expect(onOpenChange).toHaveBeenCalledWith(false)
      )
    })
  })
})
