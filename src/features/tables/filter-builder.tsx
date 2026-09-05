import { ListFilter, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type FilterCondition,
  defaultOperatorFor,
  filterFields,
  getField,
  isRangeOperator,
  operatorsByType,
} from './filters'

type FilterBuilderProps = {
  conditions: FilterCondition[]
  onChange: (conditions: FilterCondition[]) => void
}

function FilterValueInput({
  condition,
  onValueChange,
  onValueToChange,
}: {
  condition: FilterCondition
  onValueChange: (value: string) => void
  onValueToChange: (value: string) => void
}) {
  const field = getField(condition.field)
  if (!field) return null

  if (field.type === 'select') {
    return (
      <Select value={condition.value} onValueChange={onValueChange}>
        <SelectTrigger size='sm' className='w-40'>
          <SelectValue placeholder='Select value' />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const inputType =
    field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'

  if (isRangeOperator(condition.operator)) {
    return (
      <div className='flex items-center gap-1'>
        <Input
          value={condition.value}
          onChange={(event) => onValueChange(event.target.value)}
          type={inputType}
          placeholder='From'
          className='h-8 w-28'
        />
        <span className='text-xs text-muted-foreground'>and</span>
        <Input
          value={condition.valueTo}
          onChange={(event) => onValueToChange(event.target.value)}
          type={inputType}
          placeholder='To'
          className='h-8 w-28'
        />
      </div>
    )
  }

  return (
    <Input
      value={condition.value}
      onChange={(event) => onValueChange(event.target.value)}
      type={inputType}
      placeholder='Value'
      className='h-8 w-40'
    />
  )
}

export function FilterBuilder({ conditions, onChange }: FilterBuilderProps) {
  const updateCondition = (id: string, patch: Partial<FilterCondition>) => {
    onChange(
      conditions.map((condition) =>
        condition.id === id ? { ...condition, ...patch } : condition
      )
    )
  }

  const handleFieldChange = (id: string, fieldValue: string) => {
    const field = getField(fieldValue)
    if (!field) return
    updateCondition(id, {
      field: fieldValue,
      operator: defaultOperatorFor(field.type),
      value: '',
      valueTo: '',
    })
  }

  const handleOperatorChange = (id: string, operator: string) => {
    updateCondition(id, { operator, value: '', valueTo: '' })
  }

  const addCondition = () => {
    const field = filterFields[0]
    onChange([
      ...conditions,
      {
        id: crypto.randomUUID(),
        field: field.value,
        operator: defaultOperatorFor(field.type),
        value: '',
        valueTo: '',
      },
    ])
  }

  const removeCondition = (id: string) => {
    onChange(conditions.filter((condition) => condition.id !== id))
  }

  return (
    <div className='flex flex-col gap-2 rounded-md border bg-muted/30 p-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm font-medium'>
          <ListFilter className='size-4 text-muted-foreground' />
          Filters
          {conditions.length > 0 && (
            <span className='text-muted-foreground'>
              ({conditions.length} applied)
            </span>
          )}
        </div>
        {conditions.length > 0 && (
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-xs'
            onClick={() => onChange([])}
          >
            Clear all
          </Button>
        )}
      </div>

      {conditions.map((condition) => {
        const field = getField(condition.field)
        const operators = field ? operatorsByType[field.type] : []
        return (
          <div key={condition.id} className='flex flex-wrap items-center gap-2'>
            <Select
              value={condition.field}
              onValueChange={(value) => handleFieldChange(condition.id, value)}
            >
              <SelectTrigger size='sm' className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterFields.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={condition.operator}
              onValueChange={(value) =>
                handleOperatorChange(condition.id, value)
              }
            >
              <SelectTrigger size='sm' className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FilterValueInput
              condition={condition}
              onValueChange={(value) =>
                updateCondition(condition.id, { value })
              }
              onValueToChange={(valueTo) =>
                updateCondition(condition.id, { valueTo })
              }
            />

            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              onClick={() => removeCondition(condition.id)}
            >
              <X className='size-4' />
              <span className='sr-only'>Remove filter</span>
            </Button>
          </div>
        )
      })}

      <Button
        variant='outline'
        size='sm'
        className='h-8 w-fit'
        onClick={addCondition}
      >
        <Plus className='size-4' />
        Add filter
      </Button>
    </div>
  )
}
