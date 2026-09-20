import { useState } from 'react'
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { useFieldDependencies } from '@/lib/fields/use-field-dependencies'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectCombobox } from './select-combobox'

const HTML_INPUT_TYPE: Record<string, string> = {
  date: 'date',
  datetime: 'datetime-local',
}

type RenderFormFieldProps<TValues extends FieldValues> = {
  descriptor: FieldDescriptor<TValues>
  form: UseFormReturn<TValues>
  /** Masque le label — utile dans une ligne répétable où chaque colonne a déjà un en-tête. */
  hideLabel?: boolean
  /**
   * 'stacked' (défaut) : label au-dessus du champ.
   * 'grid-label' : label aligné à droite sur 2 colonnes + champ sur 4
   * colonnes (convention utilisée par les formulaires Customers/Products/
   * Ventes existants) — le parent doit fournir `grid grid-cols-6` sur le
   * conteneur du formulaire (ou passer `className` avec cette classe ici).
   */
  layout?: 'stacked' | 'grid-label'
  className?: string
}

/**
 * Adaptateur "formulaire" du système de Champ : branche un
 * `FieldDescriptor` sur react-hook-form, gère les selects dépendants, la
 * recherche serveur (`search`), le remplissage en cascade (`fillsFields`),
 * les champs calculés (`compute`) via `useFieldDependencies`, et le bouton
 * de création rapide (`quickCreate`).
 */
export function RenderFormField<TValues extends FieldValues>({
  descriptor,
  form,
  hideLabel,
  layout = 'stacked',
  className,
}: RenderFormFieldProps<TValues>) {
  const { options, isLoadingOptions, handleSelect, onSearchChange } =
    useFieldDependencies(descriptor, form)
  const isComputed = !!descriptor.compute
  const isGridLabel = layout === 'grid-label'
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)

  return (
    <FormField
      control={form.control}
      name={descriptor.name as Path<TValues>}
      render={({ field }) => (
        <FormItem
          className={cn(
            isGridLabel &&
              'grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1',
            className
          )}
        >
          {!hideLabel && (
            <FormLabel className={cn(isGridLabel && 'col-span-2 text-end')}>
              {descriptor.label}
            </FormLabel>
          )}
          <FormControl>
            {descriptor.type === 'select' ? (
              descriptor.quickCreate ? (
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isGridLabel && !hideLabel && 'col-span-4'
                  )}
                >
                  <SelectCombobox
                    value={field.value}
                    onSelect={(option) => handleSelect(option, field.onChange)}
                    options={options}
                    isLoading={isLoadingOptions}
                    placeholder={descriptor.placeholder}
                    onSearchChange={onSearchChange}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='shrink-0'
                    onClick={() => setQuickCreateOpen(true)}
                  >
                    <Plus size={16} />
                    <span className='sr-only'>{descriptor.quickCreate.title}</span>
                  </Button>
                  <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
                    <DialogContent className='sm:max-w-md'>
                      <DialogHeader>
                        <DialogTitle>{descriptor.quickCreate.title}</DialogTitle>
                        <DialogDescription>
                          The value you create will be selected automatically
                          in the &quot;{descriptor.label}&quot; field.
                        </DialogDescription>
                      </DialogHeader>
                      {descriptor.quickCreate.renderForm({
                        onSuccess: (created) => {
                          const option = descriptor.quickCreate!.toOption(created)
                          handleSelect(option, field.onChange)
                          setQuickCreateOpen(false)
                        },
                        onCancel: () => setQuickCreateOpen(false),
                      })}
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <SelectCombobox
                  value={field.value}
                  onSelect={(option) => handleSelect(option, field.onChange)}
                  options={options}
                  isLoading={isLoadingOptions}
                  placeholder={descriptor.placeholder}
                  onSearchChange={onSearchChange}
                  className={cn(isGridLabel && !hideLabel && 'col-span-4')}
                />
              )
            ) : (
              <Input
                type={HTML_INPUT_TYPE[descriptor.type] ?? 'text'}
                inputMode={descriptor.type === 'number' ? 'decimal' : undefined}
                placeholder={descriptor.placeholder}
                autoComplete={descriptor.autoComplete}
                disabled={isComputed}
                className={cn(isGridLabel && !hideLabel && 'col-span-4')}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage
            className={cn(isGridLabel && !hideLabel && 'col-span-4 col-start-3')}
          />
        </FormItem>
      )}
    />
  )
}
