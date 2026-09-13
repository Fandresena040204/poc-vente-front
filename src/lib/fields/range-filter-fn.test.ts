import { type FilterFn } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { rangeFilterFn } from './range-filter-fn'

function fakeRow(value: unknown) {
  return { getValue: () => value } as unknown as Parameters<
    FilterFn<unknown>
  >[0]
}

function apply(
  filterFn: FilterFn<unknown>,
  value: unknown,
  columnId: string,
  filterValue: { min?: string; max?: string }
) {
  return filterFn(fakeRow(value), columnId, filterValue, () => {})
}

describe('rangeFilterFn', () => {
  describe('number', () => {
    const filterFn = rangeFilterFn('number')

    it('passes when value is within min and max', () => {
      expect(apply(filterFn, 50, 'price', { min: '10', max: '100' })).toBe(
        true
      )
    })

    it('rejects when value is below min', () => {
      expect(apply(filterFn, 5, 'price', { min: '10' })).toBe(false)
    })

    it('rejects when value is above max', () => {
      expect(apply(filterFn, 150, 'price', { max: '100' })).toBe(false)
    })

    it('passes when only min or max is set and satisfied', () => {
      expect(apply(filterFn, 50, 'price', { min: '10' })).toBe(true)
      expect(apply(filterFn, 50, 'price', { max: '100' })).toBe(true)
    })

    it('rejects null/undefined/empty values', () => {
      expect(apply(filterFn, null, 'price', { min: '10' })).toBe(false)
      expect(apply(filterFn, undefined, 'price', { min: '10' })).toBe(false)
      expect(apply(filterFn, '', 'price', { min: '10' })).toBe(false)
    })
  })

  describe('date', () => {
    const filterFn = rangeFilterFn('date')

    it('passes when date is within range', () => {
      expect(
        apply(filterFn, '2026-01-15', 'created_at', {
          min: '2026-01-01',
          max: '2026-02-01',
        })
      ).toBe(true)
    })

    it('rejects when date is before min', () => {
      expect(
        apply(filterFn, '2025-12-31', 'created_at', { min: '2026-01-01' })
      ).toBe(false)
    })

    it('rejects when date is after max', () => {
      expect(
        apply(filterFn, '2026-03-01', 'created_at', { max: '2026-02-01' })
      ).toBe(false)
    })

    it('works with a Date instance as the raw value', () => {
      expect(
        apply(filterFn, new Date('2026-01-15'), 'created_at', {
          min: '2026-01-01',
        })
      ).toBe(true)
    })
  })
})
