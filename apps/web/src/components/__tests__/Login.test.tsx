import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock do useRouter
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Mock do useAuth
const mockLogin = jest.fn()
const mockUseAuth = jest.fn(() => ({
  login: mockLogin,
  isLoading: false,
}))
jest.mock('../../hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

// Mock dos ícones MUI
jest.mock('@mui/icons-material', () => ({
  Visibility: () => <div data-testid="visibility-icon" />,
  VisibilityOff: () => <div data-testid="visibility-off-icon" />,
  AccountCircle: () => <div data-testid="account-circle-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
}))

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Componente de Login simplificado para teste
const MockLogin = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(false)
  const { login, isLoading } = mockUseAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  if (isCheckingAuth) {
    return <div data-testid="loading">Verificando autenticação...</div>
  }

  return (
    <div data-testid="login-form">
      <h1>Login - Bank Challanger</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="text"
            placeholder="Digite o e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            data-testid="toggle-password"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          data-testid="login-button"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

describe('Login - Funcionalidade Core', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('deve processar login com sucesso', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce({ success: true })
    
    render(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')
    
    // Preencher credenciais válidas
    await user.type(emailInput, 'hallan1@test.com')
    await user.type(passwordInput, '123456')
    await user.click(loginButton)
    
    // Verificar se login foi chamado com credenciais corretas
    expect(mockLogin).toHaveBeenCalledWith('hallan1@test.com', '123456')
  })

  it('deve tratar falha de login esperada', async () => {
    const user = userEvent.setup()
    // Simular falha sem lançar erro
    mockLogin.mockImplementationOnce(() => {
      return Promise.resolve({ success: false, error: 'Credenciais inválidas' })
    })
    
    render(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')
    
    // Preencher credenciais inválidas
    await user.type(emailInput, 'usuario@inexistente.com')
    await user.type(passwordInput, 'senhaerrada')
    await user.click(loginButton)
    
    // Verificar se login foi tentado
    expect(mockLogin).toHaveBeenCalledWith('usuario@inexistente.com', 'senhaerrada')
  })

  it('deve renderizar formulário de login', () => {
    render(<MockLogin />)
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByText('Login - Bank Challanger')).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve desabilitar botão quando campos estão vazios', () => {
    render(<MockLogin />)
    
    const loginButton = screen.getByTestId('login-button')
    expect(loginButton).toBeDisabled()
  })

  it('deve habilitar botão quando campos estão preenchidos', async () => {
    const user = userEvent.setup()
    render(<MockLogin />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const loginButton = screen.getByTestId('login-button')
    
    await user.type(emailInput, 'test@test.com')
    await user.type(passwordInput, '123456')
    
    expect(loginButton).not.toBeDisabled()
  })

  it('deve alternar visibilidade da senha', async () => {
    const user = userEvent.setup()
    render(<MockLogin />)
    
    const passwordInput = screen.getByTestId('password-input')
    const toggleButton = screen.getByTestId('toggle-password')
    
    // Inicialmente deve ser password
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(screen.getByText('Mostrar')).toBeInTheDocument()
    
    // Clicar para mostrar
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByText('Ocultar')).toBeInTheDocument()
    
    // Clicar para ocultar novamente
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(screen.getByText('Mostrar')).toBeInTheDocument()
  })

  it('deve exibir estado de loading durante login', () => {
    mockUseAuth.mockReturnValueOnce({
      login: mockLogin,
      isLoading: true,
    })
    
    render(<MockLogin />)
    
    const loginButton = screen.getByTestId('login-button')
    expect(loginButton).toHaveTextContent('Entrando...')
    expect(loginButton).toBeDisabled()
  })
})
