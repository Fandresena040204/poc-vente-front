import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Vente } from '../data/schema'
import { VentesForm } from './ventes-form'

const mutateAsyncCreate = vi.fn()
const mutateAsyncUpdate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateVente: () => ({ mutateAsync: mutateAsyncCreate, isPending: false }),
  useUpdateVente: () => ({ mutateAsync: mutateAsyncUpdate, isPending: false }),
}))

const MOCK_CUSTOMERS = [
  { id: 'CUS00001', name: 'Acme Corp' },
  { id: 'CUS00002', name: 'Globex Inc' },
]
const MOCK_PRODUCTS = [
  { id: 'PRD00001', name: 'Clavier', sku: 'SKU-001', default_price: '49.90' },
  { id: 'PRD00002', name: 'Souris', sku: 'SKU-002', default_price: '19.90' },
]

// customer/product sont maintenant des selects en recherche serveur
// (FieldDescriptor.search) : le formulaire appelle customersApi/productsApi
// directement (fetchList pour la recherche, fetchOne pour résoudre le
// libellé d'une valeur déjà sélectionnée en édition) plutôt que les hooks
// "liste complète" useCustomers/useProducts.
vi.mock('@/features/customers/api', () => ({
  customersApi: {
    fetchList: () =>
      Promise.resolve({
        count: MOCK_CUSTOMERS.length,
        next: null,
        previous: null,
        results: MOCK_CUSTOMERS,
      }),
    fetchOne: (id: string) =>
      Promise.resolve(MOCK_CUSTOMERS.find((c) => c.id === id)),
  },
}))

vi.mock('@/features/products/api', () => ({
  productsApi: {
    fetchList: () =>
      Promise.resolve({
        count: MOCK_PRODUCTS.length,
        next: null,
        previous: null,
        results: MOCK_PRODUCTS,
      }),
    fetchOne: (id: string) =>
      Promise.resolve(MOCK_PRODUCTS.find((p) => p.id === id)),
  },
}))

// Chargés transitivement par CustomersForm/ProductsForm (popup "+" de
// création rapide) même si aucun test n'ouvre le popup — l'import statique
// du module doit résoudre.
const mutateAsyncCreateCustomer = vi.fn()

vi.mock('@/features/customers/hooks', () => ({
  useCreateCustomer: () => ({
    mutateAsync: mutateAsyncCreateCustomer,
    isPending: false,
  }),
  useUpdateCustomer: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/features/products/hooks', () => ({
  useCreateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateProduct: () => ({ mutateAsync: vi.fn(), isPending: false }),
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

describe('VentesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
    mutateAsyncUpdate.mockResolvedValue(undefined)
    mutateAsyncCreateCustomer.mockResolvedValue(undefined)
  })

  describe('add vente', () => {
    it('renders one empty line by default', async () => {
      const screen = await render(
        <VentesForm onSuccess={vi.fn()} onCancel={vi.fn()} />
      )

      await expect.element(screen.getByPlaceholder('Qty')).toBeInTheDocument()
    })

    it('adds and removes lines', async () => {
      const screen = await render(
        <VentesForm onSuccess={vi.fn()} onCancel={vi.fn()} />
      )

      expect(await screen.getByPlaceholder('Qty').all()).toHaveLength(1)

      await userEvent.click(screen.getByRole('button', { name: /Add line/i }))
      expect(await screen.getByPlaceholder('Qty').all()).toHaveLength(2)
    })

    it('creates the vente with customer and line data', async () => {
      const onSuccess = vi.fn()
      const screen = await render(
        <VentesForm onSuccess={onSuccess} onCancel={vi.fn()} />
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
      await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })

    it('quick-create : le client créé devient sélectionné dans le combobox', async () => {
      // Régression : la valeur choisie (ici via création rapide) doit
      // rester affichée même si elle n'apparaît dans aucune page de
      // résultats de recherche déjà chargée par le combobox.
      mutateAsyncCreateCustomer.mockResolvedValue({
        id: 'CUS00099',
        name: 'Nouveau Client',
        email: 'nouveau@test.com',
        phone: '',
      })
      const onSuccess = vi.fn()
      const screen = await render(
        <VentesForm onSuccess={onSuccess} onCancel={vi.fn()} />
      )

      await userEvent.click(
        screen.getByRole('button', { name: /New customer/i })
      )
      const dialog = screen.getByRole('dialog')
      await userEvent.fill(dialog.getByLabelText(/^Name$/i), 'Nouveau Client')
      await userEvent.click(
        dialog.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() =>
        expect(mutateAsyncCreateCustomer).toHaveBeenCalledOnce()
      )
      await expect
        .element(screen.getByRole('combobox').nth(0))
        .toHaveTextContent('Nouveau Client')

      await selectOption(screen, 1, /Clavier/)
      await userEvent.fill(screen.getByPlaceholder('Qty'), '1')
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
      expect(mutateAsyncCreate).toHaveBeenCalledWith(
        expect.objectContaining({ customer: 'CUS00099' })
      )
    })

    it('calls onCancel when clicking Cancel', async () => {
      const onCancel = vi.fn()
      const screen = await render(
        <VentesForm onSuccess={vi.fn()} onCancel={onCancel} />
      )

      await userEvent.click(screen.getByRole('button', { name: /Cancel/i }))
      expect(onCancel).toHaveBeenCalledOnce()
    })
  })

  describe('edit vente', () => {
    it('prefills customer and existing lines', async () => {
      const screen = await render(
        <VentesForm
          currentRow={MOCK_VENTE}
          onSuccess={vi.fn()}
          onCancel={vi.fn()}
        />
      )

      await expect.element(screen.getByPlaceholder('Qty')).toHaveValue('2')
    })

    it('updates the vente keeping the line id', async () => {
      const onSuccess = vi.fn()
      const screen = await render(
        <VentesForm
          currentRow={MOCK_VENTE}
          onSuccess={onSuccess}
          onCancel={vi.fn()}
        />
      )

      await userEvent.fill(screen.getByPlaceholder('Qty'), '5')
      await userEvent.click(
        screen.getByRole('button', { name: /Save changes/i })
      )

      await vi.waitFor(() => expect(mutateAsyncUpdate).toHaveBeenCalledOnce())
      expect(mutateAsyncUpdate).toHaveBeenCalledWith({
        id: 'VNT00001',
        payload: {
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
      await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
    })
  })
})
