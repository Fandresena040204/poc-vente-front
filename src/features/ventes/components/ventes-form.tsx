import { useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { customersApi } from '@/features/customers/api'
import { CustomersForm } from '@/features/customers/components/customers-form'
import { type Customer } from '@/features/customers/data/schema'
import { productsApi } from '@/features/products/api'
import { ProductsForm } from '@/features/products/components/products-form'
import { type Product } from '@/features/products/data/schema'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { Button } from '@/components/ui/button'
import { Form, FormLabel } from '@/components/ui/form'
import { RenderFormField } from '@/components/fields/render-form-field'
import { type Vente, type VenteForm, venteFormSchema } from '../data/schema'
import { useCreateVente, useUpdateVente } from '../hooks'

type VentesFormProps = {
  currentRow?: Vente
  onSuccess: () => void
  onCancel: () => void
}

const emptyLine = { product: '', quantity: '1', unit_price: '0.00' }

const customerField: FieldDescriptor<VenteForm> = {
  name: 'customer',
  label: 'Customer',
  type: 'select',
  placeholder: 'Search a customer...',
  search: {
    fetchOptions: (query) =>
      customersApi
        .fetchList({ page: 1, pageSize: 20, search: query })
        .then((r) =>
          r.results.map((c) => ({ label: c.name, value: c.id, data: c }))
        ),
    resolveInitial: (id) =>
      customersApi
        .fetchOne(id)
        .then((c) => ({ label: c.name, value: c.id, data: c })),
  },
  quickCreate: {
    title: 'New customer',
    renderForm: ({ onSuccess, onCancel }) => (
      <CustomersForm onSuccess={onSuccess} onCancel={onCancel} />
    ),
    toOption: (created) => ({
      label: (created as Customer).name,
      value: (created as Customer).id,
      data: created,
    }),
  },
}

function lineFields(index: number): FieldDescriptor<VenteForm>[] {
  return [
    {
      name: `lines.${index}.product`,
      label: 'Product',
      type: 'select',
      placeholder: 'Search a product...',
      search: {
        fetchOptions: (query) =>
          productsApi
            .fetchList({ page: 1, pageSize: 20, search: query })
            .then((r) =>
              r.results.map((p) => ({
                label: `${p.name} (${p.sku})`,
                value: p.id,
                data: p,
              }))
            ),
        resolveInitial: (id) =>
          productsApi
            .fetchOne(id)
            .then((p) => ({ label: `${p.name} (${p.sku})`, value: p.id, data: p })),
      },
      quickCreate: {
        title: 'New product',
        renderForm: ({ onSuccess, onCancel }) => (
          <ProductsForm onSuccess={onSuccess} onCancel={onCancel} />
        ),
        toOption: (created) => ({
          label: `${(created as Product).name} (${(created as Product).sku})`,
          value: (created as Product).id,
          data: created,
        }),
      },
      fillsFields: (selected) => ({
        [`lines.${index}.unit_price`]: (selected.data as Product)
          .default_price,
      }),
    },
    {
      name: `lines.${index}.quantity`,
      label: 'Quantity',
      type: 'number',
      placeholder: 'Qty',
    },
    {
      name: `lines.${index}.unit_price`,
      label: 'Unit price',
      type: 'number',
      placeholder: 'Unit price',
    },
  ]
}

export function VentesForm({
  currentRow,
  onSuccess,
  onCancel,
}: VentesFormProps) {
  const isEdit = !!currentRow
  const createVente = useCreateVente()
  const updateVente = useUpdateVente()
  const isPending = createVente.isPending || updateVente.isPending

  const form = useForm<VenteForm>({
    resolver: zodResolver(venteFormSchema),
    defaultValues: isEdit
      ? {
          customer: currentRow.customer,
          lines: currentRow.lines.map((line) => ({
            id: line.id,
            product: line.product,
            quantity: line.quantity,
            unit_price: line.unit_price,
          })),
        }
      : {
          customer: '',
          lines: [emptyLine],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  })

  // `lineFields(index)` construit de nouveaux `FieldDescriptor` (fonctions
  // `search`/`fillsFields` incluses) — les mémoriser par nombre de lignes
  // évite de redéclencher la recherche serveur (effet dépendant de
  // `descriptor.search` par identité) à chaque rendu du formulaire.
  const linesFieldDescriptors = useMemo(
    () => fields.map((_, index) => lineFields(index)),
    // volontaire : ne recalculer qu'au changement du nombre de lignes, pas
    // à chaque nouvelle identité du tableau `fields` (useFieldArray en crée
    // une à chaque rendu, ce qui annulerait la mémoïsation).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields.length]
  )

  function onSubmit(values: VenteForm) {
    const mutation = isEdit
      ? updateVente.mutateAsync({ id: currentRow.id, payload: values })
      : createVente.mutateAsync(values)

    mutation.then(() => {
      form.reset()
      onSuccess()
    })
  }

  return (
    <Form {...form}>
      <form
        id='vente-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-2xl space-y-4'
      >
        <RenderFormField
          descriptor={customerField}
          form={form}
          layout='grid-label'
        />

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <FormLabel>Lines</FormLabel>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => append(emptyLine)}
            >
              <Plus size={14} /> Add line
            </Button>
          </div>
          {fields.map((field, index) => {
            const [productField, quantityField, unitPriceField] =
              linesFieldDescriptors[index]
            return (
              <div
                key={field.id}
                className='grid grid-cols-12 items-start gap-2 rounded-md border p-2'
              >
                <RenderFormField
                  descriptor={productField}
                  form={form}
                  hideLabel
                  className='col-span-5 space-y-0'
                />
                <RenderFormField
                  descriptor={quantityField}
                  form={form}
                  hideLabel
                  className='col-span-3 space-y-0'
                />
                <RenderFormField
                  descriptor={unitPriceField}
                  form={form}
                  hideLabel
                  className='col-span-3 space-y-0'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='col-span-1'
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )
          })}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
