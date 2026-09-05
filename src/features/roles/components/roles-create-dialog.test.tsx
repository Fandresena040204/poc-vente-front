import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { RolesCreateDialog } from './roles-create-dialog'

const mutateAsyncCreate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateRole: () => ({ mutateAsync: mutateAsyncCreate, isPending: false }),
}))

describe('RolesCreateDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
  })

  it('renders title and description', async () => {
    const { getByRole } = await render(
      <RolesCreateDialog open onOpenChange={vi.fn()} />
    )

    await expect
      .element(getByRole('heading', { level: 2, name: /Add New Role/i }))
      .toBeInTheDocument()
  })

  it('shows a validation message when name is empty', async () => {
    const { getByRole, getByText } = await render(
      <RolesCreateDialog open onOpenChange={vi.fn()} />
    )

    await userEvent.click(getByRole('button', { name: /Save changes/i }))

    await expect.element(getByText('Name is required.')).toBeInTheDocument()
    expect(mutateAsyncCreate).not.toHaveBeenCalled()
  })

  it('creates the role with empty permissions and closes on success', async () => {
    const onOpenChange = vi.fn()
    const { getByRole, getByLabelText } = await render(
      <RolesCreateDialog open onOpenChange={onOpenChange} />
    )

    await userEvent.fill(getByLabelText(/^Name$/i), 'manager')
    await userEvent.click(getByRole('button', { name: /Save changes/i }))

    await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
    expect(mutateAsyncCreate).toHaveBeenCalledWith({
      name: 'manager',
      permissions: [],
    })
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
