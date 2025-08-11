import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
  it('renders the "Get started by editing" text', () => {
    render(<Home />)

    const getStartedText = screen.getByText(/Get started by editing/i)
    expect(getStartedText).toBeInTheDocument()
  })

  it('displays the correct file path in code block', () => {
    render(<Home />)

    const codeElement = screen.getByText('src/app/page.tsx')
    expect(codeElement).toBeInTheDocument()
  })
})
