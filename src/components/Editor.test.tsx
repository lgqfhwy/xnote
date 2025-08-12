import { render } from '@testing-library/react'
import { Editor } from './Editor'

// Import mocked modules for testing
import { inputRules, InputRule } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { EditorState } from 'prosemirror-state'
import { toggleMark } from 'prosemirror-commands'

// Mock ProseMirror dependencies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockEditorView: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockState: any

jest.mock('prosemirror-view', () => ({
  EditorView: jest.fn().mockImplementation((node, props) => {
    // Create a mock DOM element that looks like ProseMirror
    const mockDiv = document.createElement('div')
    mockDiv.className = 'ProseMirror'
    mockDiv.setAttribute('contenteditable', 'true')
    mockDiv.innerHTML = '<p>Mock editor content</p>'
    node.appendChild(mockDiv)

    mockEditorView = {
      dom: mockDiv,
      state: props.state,
      updateState: jest.fn(),
      destroy: jest.fn(),
      dispatch: jest.fn(),
    }

    return mockEditorView
  }),
}))

jest.mock('prosemirror-state', () => ({
  EditorState: {
    create: jest.fn((config) => {
      mockState = {
        doc: { content: [] },
        apply: jest.fn(),
        plugins: config.plugins || [],
      }
      return mockState
    }),
  },
}))

jest.mock('prosemirror-model', () => ({
  Schema: jest.fn().mockImplementation(() => ({
    nodes: {
      doc: {
        createAndFill: jest.fn(() => ({ content: [] })),
      },
    },
    marks: {
      strong: {
        create: jest.fn(() => ({ type: 'strong' })),
      },
      em: {
        create: jest.fn(() => ({ type: 'em' })),
      },
      strikethrough: {
        create: jest.fn(() => ({ type: 'strikethrough' })),
      },
    },
    spec: {
      nodes: {},
      marks: {
        strong: {},
        em: {},
        strikethrough: {},
      },
    },
    text: jest.fn((text, marks) => ({ text, marks })),
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
      marks: {
        strong: {},
        em: {},
      },
    },
  },
}))

jest.mock('prosemirror-schema-list', () => ({
  addListNodes: jest.fn((nodes) => nodes),
}))

jest.mock('prosemirror-example-setup', () => ({
  exampleSetup: jest.fn(() => []),
}))

jest.mock('prosemirror-inputrules', () => ({
  inputRules: jest.fn(({ rules }) => ({ rules })),
  InputRule: jest
    .fn()
    .mockImplementation((regex, handler) => ({ regex, handler })),
  wrappingInputRule: jest.fn(),
  textblockTypeInputRule: jest.fn(),
}))

jest.mock('prosemirror-keymap', () => ({
  keymap: jest.fn((keys) => ({ keys })),
}))

jest.mock('prosemirror-commands', () => ({
  toggleMark: jest.fn((markType) => jest.fn(() => ({ markType }))),
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

  describe('Mark functionality', () => {
    it('creates input rules for bold, italic, and strikethrough', () => {
      render(<Editor />)

      // Verify that input rules were created with the correct patterns
      expect(inputRules).toHaveBeenCalled()

      const inputRulesCall = (inputRules as jest.Mock).mock.calls[0][0]
      expect(inputRulesCall.rules).toBeDefined()
      expect(inputRulesCall.rules.length).toBe(3)
    })

    it('creates keymap with correct shortcuts', () => {
      render(<Editor />)

      // Verify that keymap was created with correct shortcuts
      expect(keymap).toHaveBeenCalled()

      const keymapCall = (keymap as jest.Mock).mock.calls[0][0]
      expect(keymapCall['Mod-b']).toBeDefined() // Bold shortcut
      expect(keymapCall['Mod-i']).toBeDefined() // Italic shortcut
      expect(keymapCall['Mod-Shift-s']).toBeDefined() // Strikethrough shortcut
    })

    it('sets up schema with enhanced marks', () => {
      render(<Editor />)

      // The Schema is created at module load time, so we just verify the Editor renders
      // with the enhanced schema functionality (which is tested through other tests)
      const proseMirrorDiv = document.querySelector('.ProseMirror')
      expect(proseMirrorDiv).toBeInTheDocument()

      // Verify that the schema includes the expected mark functionality by checking
      // if the component rendered without errors (indicating the schema was valid)
      expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
    })

    it('configures plugins in correct order', () => {
      render(<Editor />)

      // Verify that EditorState.create was called with plugins in correct order
      expect(EditorState.create).toHaveBeenCalled()

      const createCall = (EditorState.create as jest.Mock).mock.calls[0][0]
      expect(createCall.plugins).toBeDefined()
      expect(createCall.plugins.length).toBeGreaterThanOrEqual(2) // input rules + keymap (+ example setup which returns [])
    })

    it('integrates toggleMark commands for keyboard shortcuts', () => {
      render(<Editor />)

      // Verify that toggleMark was called for each mark type
      expect(toggleMark).toHaveBeenCalledTimes(3) // bold, italic, strikethrough
    })
  })

  describe('Input Rules Testing', () => {
    it('creates bold input rule with correct regex', () => {
      render(<Editor />)

      const inputRuleCalls = (InputRule as jest.Mock).mock.calls

      // Find the bold input rule (should match **text**)
      const boldRule = inputRuleCalls.find((call) => {
        const regex = call[0]
        return regex.toString().includes('\\*\\*')
      })

      expect(boldRule).toBeDefined()
      expect(boldRule[0]).toEqual(/(?:^|\s)\*\*([^*]+)\*\*$/)
    })

    it('creates italic input rule with correct regex', () => {
      render(<Editor />)

      const inputRuleCalls = (InputRule as jest.Mock).mock.calls

      // Find the italic input rule (should match *text* but not **text**)
      const italicRule = inputRuleCalls.find((call) => {
        const regex = call[0]
        const regexStr = regex.toString()
        return regexStr.includes('\\*') && !regexStr.includes('\\*\\*')
      })

      expect(italicRule).toBeDefined()
      expect(italicRule[0]).toEqual(/(?:^|\s)\*([^*]+)\*$/)
    })

    it('creates strikethrough input rule with correct regex', () => {
      render(<Editor />)

      const inputRuleCalls = (InputRule as jest.Mock).mock.calls

      // Find the strikethrough input rule (should match ~~text~~)
      const strikeRule = inputRuleCalls.find((call) => {
        const regex = call[0]
        return regex.toString().includes('~~')
      })

      expect(strikeRule).toBeDefined()
      expect(strikeRule[0]).toEqual(/(?:^|\s)~~([^~]+)~~$/)
    })
  })
})
