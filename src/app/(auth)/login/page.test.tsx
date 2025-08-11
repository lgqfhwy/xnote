import { render, screen } from '@testing-library/react'
import LoginPage from './page'

// Mock Supabase auth helpers
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  })),
}))

// Mock Auth UI components
jest.mock('@supabase/auth-ui-react', () => ({
  Auth: ({ providers }: { providers: string[] }) => (
    <div>
      <form>
        <input type="email" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <button type="submit">Sign In</button>
      </form>
      {providers?.includes('github') && <button>GitHub</button>}
      {providers?.includes('google') && <button>Google</button>}
    </div>
  ),
}))

// Mock window.location
const mockLocation = {
  origin: 'http://localhost:3000',
}
delete (window as any).location
window.location = mockLocation as any

describe('LoginPage', () => {
  it('renders the login form with email and password inputs', () => {
    render(<LoginPage />)

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('displays GitHub and Google social login buttons', () => {
    render(<LoginPage />)

    expect(screen.getByRole('button', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument()
  })

  it('displays the welcome title and description', () => {
    render(<LoginPage />)

    expect(screen.getByText('Welcome to XNote')).toBeInTheDocument()
    expect(
      screen.getByText('Sign in to your account or create a new one')
    ).toBeInTheDocument()
  })
})
