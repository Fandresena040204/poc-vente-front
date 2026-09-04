import { type Product, statusLabels } from './data'

export type FieldType = 'text' | 'select' | 'number' | 'date'

export type FilterOption = { label: string; value: string }

export type FilterField = {
  value: keyof Product
  label: string
  type: FieldType
  options?: FilterOption[]
}

export type FilterCondition = {
  id: string
  field: string
  operator: string
  value: string
  valueTo: string
}

const categoryOptions: FilterOption[] = [
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Displays', value: 'Displays' },
  { label: 'Office', value: 'Office' },
  { label: 'Peripherals', value: 'Peripherals' },
  { label: 'Storage', value: 'Storage' },
]

const statusOptions: FilterOption[] = Object.entries(statusLabels).map(
  ([value, label]) => ({ label, value })
)

export const filterFields: FilterField[] = [
  { value: 'name', label: 'Product', type: 'text' },
  { value: 'category', label: 'Category', type: 'select', options: categoryOptions },
  { value: 'status', label: 'Status', type: 'select', options: statusOptions },
  { value: 'price', label: 'Price', type: 'number' },
  { value: 'stock', label: 'Stock', type: 'number' },
  { value: 'updatedAt', label: 'Updated', type: 'date' },
]

export const operatorsByType: Record<FieldType, FilterOption[]> = {
  text: [
    { label: 'Like', value: 'like' },
    { label: 'Not Like', value: 'not_like' },
    { label: 'Equals', value: 'equals' },
    { label: 'Not Equals', value: 'not_equals' },
  ],
  select: [
    { label: 'Equals', value: 'equals' },
    { label: 'Not Equals', value: 'not_equals' },
  ],
  number: [
    { label: '=', value: 'equals' },
    { label: '!=', value: 'not_equals' },
    { label: '>', value: 'gt' },
    { label: '>=', value: 'gte' },
    { label: '<', value: 'lt' },
    { label: '<=', value: 'lte' },
    { label: 'Between', value: 'between' },
  ],
  date: [
    { label: 'On', value: 'equals' },
    { label: 'Before', value: 'before' },
    { label: 'After', value: 'after' },
    { label: 'Between', value: 'between' },
  ],
}

export function isRangeOperator(operator: string) {
  return operator === 'between'
}

export function getField(fieldValue: string) {
  return filterFields.find((field) => field.value === fieldValue)
}

export function defaultOperatorFor(type: FieldType) {
  return operatorsByType[type][0].value
}

export function createFilterCondition(): FilterCondition {
  const field = filterFields[0]
  return {
    id: crypto.randomUUID(),
    field: field.value,
    operator: defaultOperatorFor(field.type),
    value: '',
    valueTo: '',
  }
}

function matchText(rawValue: string, operator: string, target: string) {
  const value = rawValue.toLowerCase()
  const needle = target.toLowerCase()
  switch (operator) {
    case 'like':
      return value.includes(needle)
    case 'not_like':
      return !value.includes(needle)
    case 'equals':
      return value === needle
    case 'not_equals':
      return value !== needle
    default:
      return true
  }
}

function matchSelect(rawValue: string, operator: string, target: string) {
  switch (operator) {
    case 'equals':
      return rawValue === target
    case 'not_equals':
      return rawValue !== target
    default:
      return true
  }
}

function matchNumber(
  rawValue: number,
  operator: string,
  target: string,
  targetTo: string
) {
  if (operator === 'between') {
    const from = target === '' ? undefined : Number(target)
    const to = targetTo === '' ? undefined : Number(targetTo)
    if (from !== undefined && !Number.isNaN(from) && rawValue < from) return false
    if (to !== undefined && !Number.isNaN(to) && rawValue > to) return false
    return true
  }

  const value = Number(target)
  if (Number.isNaN(value)) return true
  switch (operator) {
    case 'equals':
      return rawValue === value
    case 'not_equals':
      return rawValue !== value
    case 'gt':
      return rawValue > value
    case 'gte':
      return rawValue >= value
    case 'lt':
      return rawValue < value
    case 'lte':
      return rawValue <= value
    default:
      return true
  }
}

function matchDate(
  rawValue: string,
  operator: string,
  target: string,
  targetTo: string
) {
  const value = new Date(rawValue).getTime()

  if (operator === 'between') {
    const from = target ? new Date(target).getTime() : undefined
    const to = targetTo ? new Date(targetTo).getTime() : undefined
    if (from !== undefined && !Number.isNaN(from) && value < from) return false
    if (to !== undefined && !Number.isNaN(to) && value > to) return false
    return true
  }

  const targetValue = new Date(target).getTime()
  switch (operator) {
    case 'equals':
      return value === targetValue
    case 'before':
      return value < targetValue
    case 'after':
      return value > targetValue
    default:
      return true
  }
}

export function matchesCondition(product: Product, condition: FilterCondition) {
  const field = getField(condition.field)
  if (!field) return true

  if (isRangeOperator(condition.operator)) {
    if (!condition.value && !condition.valueTo) return true
  } else if (!condition.value) {
    return true
  }

  const rawValue = product[field.value]

  switch (field.type) {
    case 'text':
      return matchText(String(rawValue), condition.operator, condition.value)
    case 'select':
      return matchSelect(String(rawValue), condition.operator, condition.value)
    case 'number':
      return matchNumber(
        Number(rawValue),
        condition.operator,
        condition.value,
        condition.valueTo
      )
    case 'date':
      return matchDate(
        String(rawValue),
        condition.operator,
        condition.value,
        condition.valueTo
      )
    default:
      return true
  }
}

export function filterProducts(products: Product[], conditions: FilterCondition[]) {
  return products.filter((product) =>
    conditions.every((condition) => matchesCondition(product, condition))
  )
}
