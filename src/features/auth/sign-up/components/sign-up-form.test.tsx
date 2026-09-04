import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { SignUpForm } from './sign-up-form'

const FORM_MESSAGES = {
  usernameEmpty: 'Please enter a username.',
  emailEmpty: 'Please enter your email.',
  passwordEmpty: 'Please enter your password.',
  confirmPasswordEmpty: 'Please confirm your password.',
  passwordMismatch: "Passwords don't match.",
} as const

const navigate = vi.fn()
const setUserMock = vi.fn()
const setTokensMock = vi.fn()
const registerMock = vi.fn()
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
  register: (...args: unknown[]) => registerMock(...args),
  fetchMe: (...args: unknown[]) => fetchMeMock(...args),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return { ...actual, useNavigate: () => navigate }
})

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('SignUpForm', () => {
  let screen: RenderResult
  let usernameInput: Locator
  let emailInput: Locator
  let passwordInput: Locator
  let confirmPasswordInput: Locator
  let submitButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()
    registerMock.mockResolvedValue({
      user: { id: 'USR00002', username: 'alice', email: 'a@b.com' },
      access: 'access-token',
      refresh: 'refresh-token',
    })
    fetchMeMock.mockResolvedValue({
      id: 'USR00002',
      username: 'alice',
      email: 'a@b.com',
      first_name: '',
      last_name: '',
      roles: [],
      permissions: [],
    })

    screen = await renderWithClient(<SignUpForm />)
    usernameInput = screen.getByRole('textbox', { name: /^Username$/i })
    emailInput = screen.getByRole('textbox', { name: /^Email$/i })
    passwordInput = screen.getByLabelText(/^Password$/i)
    confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/i)
    submitButton = screen.getByRole('button', { name: /^Create Account$/i })
  })

  it('renders fields and submit button', async () => {
    await expect.element(usernameInput).toBeInTheDocument()
    await expect.element(emailInput).toBeInTheDocument()
    await expect.element(passwordInput).toBeInTheDocument()
    await expect.element(confirmPasswordInput).toBeInTheDocument()
    await expect.element(submitButton).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    await userEvent.click(submitButton)

    await expect
      .element(screen.getByText(FORM_MESSAGES.usernameEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.emailEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.confirmPasswordEmpty))
      .toBeInTheDocument()
  })

  it('shows a mismatch error when passwords do not match', async () => {
    await userEvent.fill(usernameInput, 'alice')
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '12345678')
    await userEvent.fill(confirmPasswordInput, '87654321')

    await userEvent.click(submitButton)
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordMismatch))
      .toBeInTheDocument()
  })

  it('registers, logs in the new user, and navigates home on success', async () => {
    await userEvent.fill(usernameInput, 'alice')
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '12345678')
    await userEvent.fill(confirmPasswordInput, '12345678')

    await userEvent.click(submitButton)

    await vi.waitFor(() => expect(registerMock).toHaveBeenCalledOnce())
    expect(registerMock).toHaveBeenCalledWith({
      username: 'alice',
      email: 'a@b.com',
      password: '12345678',
    })

    await vi.waitFor(() => expect(setTokensMock).toHaveBeenCalledOnce())
    expect(setTokensMock).toHaveBeenCalledWith('access-token', 'refresh-token')

    await vi.waitFor(() => expect(setUserMock).toHaveBeenCalledOnce())

    await vi.waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/', replace: true })
    )
  })
})
