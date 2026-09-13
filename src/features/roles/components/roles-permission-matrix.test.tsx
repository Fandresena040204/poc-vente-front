import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type Role } from '../data/schema'
import { RolesPermissionMatrix } from './roles-permission-matrix'

const mutateUpdate = vi.fn()

vi.mock('../hooks', () => ({
  useUpdateRole: () => ({ mutate: mutateUpdate, isPending: false }),
}))

const ROLES: Role[] = [
  { id: 'ROL00001', name: 'admin', permissions: ['view_customer'] },
  { id: 'ROL00002', name: 'user', permissions: [] },
]

describe('RolesPermissionMatrix', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders a checkbox per role and permission, checked according to current state', async () => {
    const { getByRole } = await render(
      <RolesPermissionMatrix roles={ROLES} onDelete={vi.fn()} />
    )

    const viewCustomerCheckbox = getByRole('checkbox').nth(0)
    await expect.element(viewCustomerCheckbox).toBeChecked()
  })

  it('adds the permission when checking an unchecked box', async () => {
    const { getByRole } = await render(
      <RolesPermissionMatrix roles={ROLES} onDelete={vi.fn()} />
    )

    // second checkbox in the first row (view_customer) belongs to the 'user' role
    await userEvent.click(getByRole('checkbox').nth(1))

    expect(mutateUpdate).toHaveBeenCalledWith({
      id: 'ROL00002',
      payload: { name: 'user', permissions: ['view_customer'] },
    })
  })

  it('removes the permission when unchecking a checked box', async () => {
    const { getByRole } = await render(
      <RolesPermissionMatrix roles={ROLES} onDelete={vi.fn()} />
    )

    // first checkbox in the first row (view_customer) belongs to 'admin', already checked
    await userEvent.click(getByRole('checkbox').nth(0))

    expect(mutateUpdate).toHaveBeenCalledWith({
      id: 'ROL00001',
      payload: { name: 'admin', permissions: [] },
    })
  })
})
