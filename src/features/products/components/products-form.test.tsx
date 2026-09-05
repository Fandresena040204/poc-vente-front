import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Product } from '../data/schema'
import { ProductsForm } from './products-form'

const mutateAsyncCreate = vi.fn()
const mutateAsyncUpdate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateProduct: () => ({
    mutateAsync: mutateAsyncCreate,
    isPending: false,
  }),
  useUpdateProduct: () => ({
    mutateAsync: mutateAsyncUpdate,
    isPending: false,
  }),
}))

const MOCK_PRODUCT: Product = {
  id: 'PRD00001',
  name: 'Clavier mécanique',
  sku: 'SKU-001',
  default_price: '49.90',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

async function fillFields(
  screen: RenderResult,
  fields: { name?: string; sku?: string; default_price?: string }
) {
  if (fields.name !== undefined) {
    await userEvent.fill(screen.getByLabelText(/^Name$/i), fields.name)
  }
  if (fields.sku !== undefined) {
    await userEvent.fill(screen.getByLabelText(/^SKU$/i), fields.sku)
  }
  if (fields.default_price !== undefined) {
    await userEvent.fill(
      screen.getByLabelText(/^Default price$/i),
      fields.default_price
    )
  }
}

describe('ProductsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
    mutateAsyncUpdate.mockResolvedValue(undefined)
  })

  describe('add product', () => {
    it('shows validation messages when fields are empty or invalid', async () => {
      const screen = await render(
        <ProductsForm onSuccess={vi.fn()} onCancel={vi.fn()} />
      )

      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await expect
        .element(screen.getByText('Name is required.'))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('SKU is required.'))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Default price is required.'))
        .toBeInTheDocument()

      await fillFields(screen, { default_price: 'not-a-number' })
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )
      await expect
        .element(screen.getByText('Enter a valid amount (e.g. 19.99).'))
        .toBeInTheDocument()

      expect(mutateAsyncCreate).not.toHaveBeenCalled()
    })

    it('creates the product and calls onSuccess', async () => {
      const onSuccess = vi.fn()
      const screen = await render(
        <ProductsForm onSuccess={onSuccess} onCancel={vi.fn()} />
      )

      await fillFields(screen, {
        name: 'Clavier mécanique',
        sku: 'SKU-001',
        default_price: '49.90',
      })
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
      expect(mutateAsyncCreate).toHaveBeenCalledWith({
        name: 'Clavier mécanique',
        sku: 'SKU-001',
        default_price: '49.90',
      })
      await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })
  })

  describe('edit product', () => {
    it('renders prefilled fields', async () => {
      const screen = await render(
        <ProductsForm
          currentRow={MOCK_PRODUCT}
          onSuccess={vi.fn()}
          onCancel={vi.fn()}
        />
      )

      await expect
        .element(screen.getByLabelText(/^SKU$/i))
        .toHaveValue(MOCK_PRODUCT.sku)
    })

    it('updates the product and calls onSuccess', async () => {
      const onSuccess = vi.fn()
      const screen = await render(
        <ProductsForm
          currentRow={MOCK_PRODUCT}
          onSuccess={onSuccess}
          onCancel={vi.fn()}
        />
      )

      await fillFields(screen, { default_price: '39.90' })
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncUpdate).toHaveBeenCalledOnce())
      expect(mutateAsyncUpdate).toHaveBeenCalledWith({
        id: MOCK_PRODUCT.id,
        payload: {
          name: MOCK_PRODUCT.name,
          sku: MOCK_PRODUCT.sku,
          default_price: '39.90',
        },
      })
      await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })
  })
})
