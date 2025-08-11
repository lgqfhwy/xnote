import { render, screen, fireEvent } from '@testing-library/react'
import Home from './page'

// Mock window properties for jsdom compatibility
Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
})

describe('Home Page Layout', () => {
  test('renders main layout regions with correct ARIA roles', () => {
    render(<Home />)

    // Check for main layout regions with correct ARIA roles
    expect(screen.getByRole('banner')).toBeInTheDocument() // Top Bar
    expect(screen.getByRole('navigation')).toBeInTheDocument() // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument() // Main Content Area
    expect(screen.getByRole('status')).toBeInTheDocument() // Status Bar
  })

  test('sidebar toggle button changes sidebar visibility', () => {
    render(<Home />)

    // Find the sidebar toggle button
    const toggleButton = screen.getByLabelText('Toggle sidebar')

    // Initially, sidebar should be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument()

    // Click to hide sidebar
    fireEvent.click(toggleButton)

    // Sidebar should now be hidden
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    // Click to show sidebar again
    fireEvent.click(toggleButton)

    // Sidebar should be visible again
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders welcome content', () => {
    render(<Home />)

    expect(screen.getByText('Welcome to XNote')).toBeInTheDocument()
    expect(screen.getByText(/The ultimate Markdown editor/)).toBeInTheDocument()
  })
})
