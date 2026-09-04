import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Vente } from '../data/schema'
import { VentesActionDialog } from './ventes-action-dialog'

const mutateAsyncCreate = vi.fn()
const mutateAsyncUpdate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateVente: () => ({ mutateAsync: mutateAsyncCreate, isPending: false }),
  useUpdateVente: () => ({ mutateAsync: mutateAsyncUpdate, isPending: false }),
}))

vi.mock('@/features/customers/hooks', () => ({
  useCustomers: () => ({
    data: [
      { id: 'CUS00001', name: 'Acme Corp' },
      { id: 'CUS00002', name: 'Globex Inc' },
    ],
  }),
}))

vi.mock('@/features/products/hooks', () => ({
  useProducts: () => ({
    data: [
      { id: 'PRD00001', name: 'Clavier', sku: 'SKU-001' },
      { id: 'PRD00002', name: 'Souris', sku: 'SKU-002' },
    ],
  }),
}))

const MOCK_VENTE: Vente = {
  id: 'VNT00001',
  customer: 'CUS00001',
  status: 'draft',
  total: '99.80',
  lines: [
    { id: 'LGN00001', product: 'PRD00001', quantity: '2', unit_price: '49.90' },
  ],
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
}

async function selectOption(
  screen: RenderResult,
  comboboxIndex: number,
  optionName: string | RegExp
) {
  const combobox = screen.getByRole('combobox').nth(comboboxIndex)
  await userEvent.click(combobox)
  await userEvent.click(screen.getByRole('option', { name: optionName }))
}

describe('VentesActionDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
    mutateAsyncUpdate.mockResolvedValue(undefined)
  })

  describe('add vente', () => {
    it('renders title, description and one empty line by default', async () => {
      const screen = await render(
        <VentesActionDialog open onOpenChange={vi.fn()} />
      )

      await expect
        .element(
          screen.getByRole('heading', { level: 2, name: /Add New Vente/i })
        )
        .toBeInTheDocument()
      await expect
        .element(screen.getByPlaceholder('Qty'))
        .toBeInTheDocument()
    })

    it('adds and removes lines', async () => {
      const screen = await render(
        <VentesActionDialog open onOpenChange={vi.fn()} />
      )

      expect(await screen.getByPlaceholder('Qty').all()).toHaveLength(1)

      await userEvent.click(screen.getByRole('button', { name: /Add line/i }))
      expect(await screen.getByPlaceholder('Qty').all()).toHaveLength(2)
    })

    it('creates the vente with customer and line data', async () => {
      const onOpenChange = vi.fn()
      const screen = await render(
        <VentesActionDialog open onOpenChange={onOpenChange} />
      )

      await selectOption(screen, 0, 'Acme Corp')
      await selectOption(screen, 1, /Clavier/)
      await userEvent.fill(screen.getByPlaceholder('Qty'), '3')
      await userEvent.fill(screen.getByPlaceholder('Unit price'), '10.00')

      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
      expect(mutateAsyncCreate).toHaveBeenCalledWith({
        customer: 'CUS00001',
        lines: [{ product: 'PRD00001', quantity: '3', unit_price: '10.00' }],
      })
      await vi.waitFor(() =>
        expect(onOpenChange).toHaveBeenCalledWith(false)
      )
    })
  })

  describe('edit vente', () => {
    it('prefills customer and existing lines', async () => {
      const screen = await render(
        <VentesActionDialog
          open
          onOpenChange={vi.fn()}
          currentRow={MOCK_VENTE}
        />
      )

      await expect
        .element(
          screen.getByRole('heading', { level: 2, name: /Edit Vente/i })
        )
        .toBeInTheDocument()
      await expect
        .element(screen.getByPlaceholder('Qty'))
        .toHaveValue('2')
    })

    it('updates the vente keeping the line id', async () => {
      const onOpenChange = vi.fn()
      const screen = await render(
        <VentesActionDialog
          open
          onOpenChange={onOpenChange}
          currentRow={MOCK_VENTE}
        />
      )

      await userEvent.fill(screen.getByPlaceholder('Qty'), '5')
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncUpdate).toHaveBeenCalledOnce())
      expect(mutateAsyncUpdate).toHaveBeenCalledWith({
        id: 'VNT00001',
        values: {
          customer: 'CUS00001',
          lines: [
            {
              id: 'LGN00001',
              product: 'PRD00001',
              quantity: '5',
              unit_price: '49.90',
            },
          ],
        },
      })
      await vi.waitFor(() =>
        expect(onOpenChange).toHaveBeenCalledWith(false)
      )
    })
  })
})
