import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { RolesForm } from './roles-form'

const mutateAsyncCreate = vi.fn()

vi.mock('../hooks', () => ({
  useCreateRole: () => ({ mutateAsync: mutateAsyncCreate, isPending: false }),
}))

describe('RolesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mutateAsyncCreate.mockResolvedValue(undefined)
  })

  it('shows a validation message when name is empty', async () => {
    const screen = await render(
      <RolesForm onSuccess={vi.fn()} onCancel={vi.fn()} />
    )

    await userEvent.click(screen.getByRole('button', { name: /Save changes/i }))

    await expect
      .element(screen.getByText('Name is required.'))
      .toBeInTheDocument()
    expect(mutateAsyncCreate).not.toHaveBeenCalled()
  })

  it('creates the role with empty permissions and calls onSuccess', async () => {
    const onSuccess = vi.fn()
    const screen = await render(
      <RolesForm onSuccess={onSuccess} onCancel={vi.fn()} />
    )

    await userEvent.fill(screen.getByLabelText(/^Name$/i), 'manager')
    await userEvent.click(screen.getByRole('button', { name: /Save changes/i }))

    await vi.waitFor(() => expect(mutateAsyncCreate).toHaveBeenCalledOnce())
    expect(mutateAsyncCreate).toHaveBeenCalledWith({
      name: 'manager',
      permissions: [],
    })
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    const screen = await render(
      <RolesForm onSuccess={vi.fn()} onCancel={onCancel} />
    )

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })
})
