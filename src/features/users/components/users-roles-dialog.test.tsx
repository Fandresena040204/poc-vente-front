import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { type User } from '../data/schema'
import { UsersRolesDialog } from './users-roles-dialog'

const mutateAsyncAssign = vi.fn()
const mutateAsyncRemove = vi.fn()

vi.mock('../hooks', () => ({
  useAssignRole: () => ({ mutateAsync: mutateAsyncAssign, isPending: false }),
  useRemoveRole: () => ({ mutateAsync: mutateAsyncRemove, isPending: false }),
}))

vi.mock('@/features/roles/hooks', () => ({
  useRoles: () => ({
    data: [
      { id: 'ROL00001', name: 'admin', permissions: [] },
      { id: 'ROL00002', name: 'editor', permissions: [] },
      { id: 'ROL00003', name: 'user', permissions: [] },
    ],
  }),
}))

const MOCK_USER: User = {
  id: 'USR00002',
  username: 'alice',
  email: 'alice@example.com',
  is_active: true,
  is_staff: false,
  roles: ['user'],
}

describe('UsersRolesDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncAssign.mockResolvedValue(undefined)
    mutateAsyncRemove.mockResolvedValue(undefined)
  })

  it('renders one checkbox per role, checked according to the user roles', async () => {
    const { getByRole } = await render(
      <UsersRolesDialog open onOpenChange={vi.fn()} currentRow={MOCK_USER} />
    )

    await expect
      .element(getByRole('checkbox', { name: /^admin$/i }))
      .not.toBeChecked()
    await expect
      .element(getByRole('checkbox', { name: /^user$/i }))
      .toBeChecked()
  })

  it('assigns newly checked roles and removes unchecked ones on save', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <UsersRolesDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_USER}
      />
    )

    await userEvent.click(getByRole('checkbox', { name: /^editor$/i }))
    await userEvent.click(getByRole('checkbox', { name: /^user$/i }))
    await userEvent.click(getByRole('button', { name: /Save changes/i }))

    await vi.waitFor(() => expect(mutateAsyncAssign).toHaveBeenCalledOnce())
    expect(mutateAsyncAssign).toHaveBeenCalledWith({
      id: 'USR00002',
      role: 'editor',
    })
    expect(mutateAsyncRemove).toHaveBeenCalledWith({
      id: 'USR00002',
      role: 'user',
    })
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
