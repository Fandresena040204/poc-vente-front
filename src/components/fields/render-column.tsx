import { Link, type LinkProps } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  type FieldDescriptor,
  type FieldOption,
} from '@/lib/fields/field-descriptor'
import { getDisplayValue } from '@/lib/fields/get-display-value'

type RenderColumnOptions<TRow> = {
  resolvedOptions?: FieldOption[]
  /** Options TanStack Table additionnelles (filterFn, enableSorting, enableHiding...), fusionnées après le rendu par défaut. */
  columnDef?: Partial<ColumnDef<TRow>>
}

/**
 * Adaptateur "colonne de liste" du système de Champ : construit une
 * `ColumnDef` TanStack Table depuis un `FieldDescriptor`, en résolvant les
 * `select` en libellé, en enveloppant la valeur dans un lien si
 * `clickable`, ou en délégant entièrement au rendu custom de
 * `descriptor.render` (Badge, LongText, etc.) s'il est fourni.
 *
 * Note : `linkTo` retourne une route dynamique (calculée depuis la ligne),
 * ce que le typage strict des routes TanStack Router ne peut pas valider à
 * la compilation — d'où le cast local sur `to`.
 */
export function renderColumn<TRow extends Record<string, unknown>>(
  descriptor: FieldDescriptor<TRow>,
  options?: RenderColumnOptions<TRow>
): ColumnDef<TRow> {
  return {
    accessorKey: descriptor.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={descriptor.label} />
    ),
    cell: ({ row }) => {
      if (descriptor.render) {
        return descriptor.render(row.original)
      }

      const value = getDisplayValue(
        descriptor,
        row.original,
        options?.resolvedOptions
      )

      if (descriptor.clickable && descriptor.linkTo) {
        const { to, params } = descriptor.linkTo(row.original)
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Link to={to as LinkProps['to']} params={params as any}>
            {value}
          </Link>
        )
      }

      return <div>{value}</div>
    },
    ...options?.columnDef,
  }
}
