import { render, screen } from '@testing-library/react'
import { Editor } from './Editor'

// Mock ProseMirror dependencies
jest.mock('prosemirror-view', () => ({
  EditorView: jest.fn().mockImplementation((node, props) => {
    // Create a mock DOM element that looks like ProseMirror
    const mockDiv = document.createElement('div')
    mockDiv.className = 'ProseMirror'
    mockDiv.setAttribute('contenteditable', 'true')
    mockDiv.innerHTML = '<p>Mock editor content</p>'
    node.appendChild(mockDiv)

    return {
      dom: mockDiv,
      state: props.state,
      updateState: jest.fn(),
      destroy: jest.fn(),
      dispatch: jest.fn(),
    }
  }),
}))

jest.mock('prosemirror-state', () => ({
  EditorState: {
    create: jest.fn(() => ({
      doc: { content: [] },
      apply: jest.fn(),
    })),
  },
}))

jest.mock('prosemirror-model', () => ({
  Schema: jest.fn(() => ({
    nodes: {
      doc: {
        createAndFill: jest.fn(() => ({ content: [] })),
      },
    },
    spec: {
      nodes: {},
      marks: {},
    },
  })),
  DOMParser: {
    fromSchema: jest.fn(() => ({
      parse: jest.fn(() => ({ content: [] })),
    })),
  },
}))

jest.mock('prosemirror-schema-basic', () => ({
  schema: {
    spec: {
      nodes: {},
      marks: {},
    },
  },
}))

jest.mock('prosemirror-schema-list', () => ({
  addListNodes: jest.fn((nodes) => nodes),
}))

jest.mock('prosemirror-example-setup', () => ({
  exampleSetup: jest.fn(() => []),
}))

jest.mock('prosemirror-history', () => ({
  history: jest.fn(() => ({})),
}))

jest.mock('prosemirror-commands', () => ({
  baseKeymap: {},
}))

jest.mock('prosemirror-keymap', () => ({
  keymap: jest.fn(() => ({})),
}))

describe('Editor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the editor component', () => {
    render(<Editor />)

    // Check if the editor container is present
    const editorContainer = document.querySelector('.ProseMirror-editor')
    expect(editorContainer).toBeInTheDocument()
  })

  it('renders with ProseMirror class', () => {
    render(<Editor />)

    // Check if the ProseMirror div is present
    const proseMirrorDiv = document.querySelector('.ProseMirror')
    expect(proseMirrorDiv).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Editor className="custom-editor" />)

    const editorWrapper = document.querySelector('.custom-editor')
    expect(editorWrapper).toBeInTheDocument()
  })

  it('has contentEditable attribute', () => {
    render(<Editor />)

    const proseMirrorDiv = document.querySelector('.ProseMirror')
    expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
  })

  it('contains mock editor content', () => {
    render(<Editor />)

    const proseMirrorDiv = document.querySelector('.ProseMirror')
    expect(proseMirrorDiv).toHaveTextContent('Mock editor content')
  })
})
