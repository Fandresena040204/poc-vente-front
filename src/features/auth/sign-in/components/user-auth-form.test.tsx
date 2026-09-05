import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { UserAuthForm } from './user-auth-form'

const navigate = vi.fn()
const setUserMock = vi.fn()
const setTokensMock = vi.fn()
const loginMock = vi.fn()
const fetchMeMock = vi.fn()

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    auth: {
      setUser: setUserMock,
      setTokens: setTokensMock,
    },
  }),
}))

vi.mock('../../api', () => ({
  login: (...args: unknown[]) => loginMock(...args),
  fetchMe: (...args: unknown[]) => fetchMeMock(...args),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => navigate,
    Link: ({
      children,
      to,
      className,
      ...rest
    }: {
      children?: React.ReactNode
      to: string
      className?: string
    }) => (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    ),
  }
})

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('UserAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loginMock.mockResolvedValue({
      access: 'access-token',
      refresh: 'refresh-token',
    })
    fetchMeMock.mockResolvedValue({
      id: 'USR00001',
      username: 'alice',
      email: 'alice@example.com',
      first_name: '',
      last_name: '',
      roles: ['user'],
      permissions: ['add_customer', 'view_customer'],
    })
  })

  describe('Rendering without redirectTo', () => {
    let screen: RenderResult
    let usernameInput: Locator
    let passwordInput: Locator
    let signInButton: Locator
    let forgotPasswordLink: Locator

    beforeEach(async () => {
      screen = await renderWithClient(<UserAuthForm />)
      usernameInput = screen.getByRole('textbox', { name: /^Username$/i })
      passwordInput = screen.getByLabelText(/^Password$/i)
      signInButton = screen.getByRole('button', { name: /^Sign in$/i })
      forgotPasswordLink = screen.getByText(/^Forgot password\?$/i)
    })

    it('renders fields, submit button, and forgot password link', async () => {
      await expect.element(usernameInput).toBeInTheDocument()
      await expect.element(passwordInput).toBeInTheDocument()
      await expect.element(signInButton).toBeInTheDocument()
      await expect.element(forgotPasswordLink).toBeInTheDocument()
    })

    it('shows validation messages when submitting empty form', async () => {
      await userEvent.click(signInButton)

      await expect
        .element(screen.getByText('Please enter your username.'))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Please enter your password.'))
        .toBeInTheDocument()
    })

    it('authenticates and navigates to default route on success', async () => {
      await userEvent.fill(usernameInput, 'alice')
      await userEvent.fill(passwordInput, 'pass1234')

      await userEvent.click(signInButton)

      await vi.waitFor(() => expect(setTokensMock).toHaveBeenCalledOnce())
      expect(setTokensMock).toHaveBeenCalledWith(
        'access-token',
        'refresh-token'
      )
      expect(loginMock).toHaveBeenCalledWith({
        username: 'alice',
        password: 'pass1234',
      })

      await vi.waitFor(() => expect(setUserMock).toHaveBeenCalledOnce())
      expect(setUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'alice' })
      )

      await vi.waitFor(() =>
        expect(navigate).toHaveBeenCalledWith({ to: '/', replace: true })
      )
    })
  })

  it('navigates to redirectTo when provided', async () => {
    const { getByRole, getByLabelText } = await renderWithClient(
      <UserAuthForm redirectTo='/settings' />
    )

    await userEvent.fill(getByRole('textbox', { name: /Username/i }), 'alice')
    await userEvent.fill(getByLabelText('Password'), 'pass1234')

    await userEvent.click(getByRole('button', { name: /Sign in/i }))

    await vi.waitFor(() => expect(setUserMock).toHaveBeenCalledOnce())

    await vi.waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({
        to: '/settings',
        replace: true,
      })
    )
  })
})
