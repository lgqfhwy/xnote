import { render, screen } from '@testing-library/react'
import Home from './page'

// Mock UserInfo component
jest.mock('../components/UserInfo', () => ({
  UserInfo: () => <div data-testid="user-info">User Info</div>,
}))

describe('Home', () => {
  it('renders the welcome title and description', () => {
    render(<Home />)

    expect(screen.getByText('Welcome to XNote')).toBeInTheDocument()
    expect(
      screen.getByText(/The ultimate Markdown editor/i)
    ).toBeInTheDocument()
  })

  it('displays authentication status messages', () => {
    render(<Home />)

    expect(screen.getByText(/successfully authenticated/i)).toBeInTheDocument()
    expect(screen.getByText(/protected by middleware/i)).toBeInTheDocument()
  })

  it('renders the UserInfo component', () => {
    render(<Home />)

    expect(screen.getByTestId('user-info')).toBeInTheDocument()
  })
})
