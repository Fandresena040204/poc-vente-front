import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { ResourceDeleteDialog } from './resource-delete-dialog'

describe('ResourceDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with title, description and disabled delete button', async () => {
    const { getByRole, getByText } = await render(
      <ResourceDeleteDialog
        open
        onOpenChange={vi.fn()}
        resourceLabel='Product'
        itemLabel='Clavier mécanique'
        confirmValue='SKU-001'
        confirmFieldLabel='SKU'
        onDelete={vi.fn().mockResolvedValue(undefined)}
        isPending={false}
      />
    )

    const title = getByRole('heading', { level: 2, name: /Delete Product/i })
    const desc = getByText(/Are you sure you want to delete/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the confirm value matches exactly', async () => {
    const { getByRole, getByPlaceholder } = await render(
      <ResourceDeleteDialog
        open
        onOpenChange={vi.fn()}
        resourceLabel='Product'
        itemLabel='Clavier mécanique'
        confirmValue='SKU-001'
        confirmFieldLabel='SKU'
        onDelete={vi.fn().mockResolvedValue(undefined)}
        isPending={false}
      />
    )

    const skuInput = getByPlaceholder(/Enter sku/i)
    const deleteButton = getByRole('button', { name: /^Delete$/i })

    await userEvent.fill(skuInput, 'wrong-sku')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(skuInput, 'SKU-001')
    await expect.element(deleteButton).toBeEnabled()
  })

  it('calls onDelete and closes the dialog on success', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    const { getByRole, getByPlaceholder } = await render(
      <ResourceDeleteDialog
        open
        onOpenChange={onOpenChange}
        resourceLabel='Product'
        itemLabel='Clavier mécanique'
        confirmValue='SKU-001'
        confirmFieldLabel='SKU'
        onDelete={onDelete}
        isPending={false}
      />
    )

    await userEvent.fill(getByPlaceholder(/Enter sku/i), 'SKU-001')
    await userEvent.click(getByRole('button', { name: /^Delete$/i }))

    await vi.waitFor(() => expect(onDelete).toHaveBeenCalledOnce())
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('closes the dialog when cancel is clicked', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <ResourceDeleteDialog
        open
        onOpenChange={onOpenChange}
        resourceLabel='Product'
        itemLabel='Clavier mécanique'
        confirmValue='SKU-001'
        confirmFieldLabel='SKU'
        onDelete={onDelete}
        isPending={false}
      />
    )

    await userEvent.click(getByRole('button', { name: /Cancel/i }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onDelete).not.toHaveBeenCalled()
  })
})
