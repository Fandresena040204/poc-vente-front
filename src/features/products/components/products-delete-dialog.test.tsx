import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Product } from '../data/schema'
import { ProductsDeleteDialog } from './products-delete-dialog'

const mutateDelete = vi.fn()

vi.mock('../hooks', () => ({
  useDeleteProduct: () => ({ mutate: mutateDelete, isPending: false }),
}))

const MOCK_PRODUCT: Product = {
  id: 'PRD00001',
  name: 'Clavier mécanique',
  sku: 'SKU-001',
  default_price: '49.90',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

describe('ProductsDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with title, description and disabled delete button', async () => {
    const { getByRole, getByText } = await render(
      <ProductsDeleteDialog
        open
        onOpenChange={vi.fn()}
        currentRow={MOCK_PRODUCT}
      />
    )

    const title = getByRole('heading', { level: 2, name: /Delete Product/i })
    const desc = getByText(
      new RegExp(`Are you sure you want to delete ${MOCK_PRODUCT.name}?`, 'i')
    )
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the SKU input matches exactly', async () => {
    const { getByRole, getByPlaceholder } = await render(
      <ProductsDeleteDialog
        open
        onOpenChange={vi.fn()}
        currentRow={MOCK_PRODUCT}
      />
    )

    const skuInput = getByPlaceholder(/Enter product SKU/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await userEvent.fill(skuInput, 'wrong-sku')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(skuInput, MOCK_PRODUCT.sku)
    await expect.element(deleteButton).toBeEnabled()
  })

  it('calls the delete mutation and closes the dialog on success', async () => {
    mutateDelete.mockImplementation(
      (_id: string, { onSuccess }: { onSuccess: () => void }) => onSuccess()
    )
    const onOpenChange = vi.fn()
    const { getByRole, getByPlaceholder } = await render(
      <ProductsDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_PRODUCT}
      />
    )

    await userEvent.fill(
      getByPlaceholder(/Enter product SKU/i),
      MOCK_PRODUCT.sku
    )
    await userEvent.click(getByRole('button', { name: /^Delete$/i }))

    expect(mutateDelete).toHaveBeenCalledWith(
      MOCK_PRODUCT.id,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes the dialog when cancel is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <ProductsDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_PRODUCT}
      />
    )

    await userEvent.click(getByRole('button', { name: /Cancel/i }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(mutateDelete).not.toHaveBeenCalled()
  })
})
