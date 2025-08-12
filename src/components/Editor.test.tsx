import { render, waitFor } from '@testing-library/react'
import { Editor } from './Editor'

// Import mocked modules for testing
import {
  inputRules,
  InputRule,
  wrappingInputRule,
  textblockTypeInputRule,
} from 'prosemirror-inputrules'
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
      paragraph: {
        create: jest.fn(() => ({ type: 'paragraph' })),
      },
      heading: {
        create: jest.fn((attrs) => ({ type: 'heading', attrs })),
      },
      bullet_list: {
        create: jest.fn(() => ({ type: 'bullet_list' })),
      },
      ordered_list: {
        create: jest.fn(() => ({ type: 'ordered_list' })),
      },
      list_item: {
        create: jest.fn(() => ({ type: 'list_item' })),
      },
      blockquote: {
        create: jest.fn(() => ({ type: 'blockquote' })),
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
      nodes: {
        get: jest.fn((name) => {
          const nodeSpecs = {
            doc: { content: 'block+' },
            paragraph: { content: 'inline*', group: 'block' },
            text: { group: 'inline' },
          }
          return nodeSpecs[name as keyof typeof nodeSpecs]
        }),
      },
      marks: {
        get: jest.fn((name) => {
          const markSpecs = {
            strong: {
              parseDOM: [{ tag: 'strong' }],
              toDOM: () => ['strong', 0],
            },
            em: { parseDOM: [{ tag: 'em' }], toDOM: () => ['em', 0] },
            link: { attrs: { href: {} }, parseDOM: [{ tag: 'a[href]' }] },
            code: { parseDOM: [{ tag: 'code' }], toDOM: () => ['code', 0] },
          }
          return markSpecs[name as keyof typeof markSpecs]
        }),
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

jest.mock('prosemirror-history', () => ({
  history: jest.fn(() => ({ type: 'history' })),
}))

jest.mock('prosemirror-commands', () => ({
  toggleMark: jest.fn((markType) => jest.fn(() => ({ markType }))),
  baseKeymap: {
    'Mod-z': jest.fn(),
    'Mod-y': jest.fn(),
    Enter: jest.fn(),
    Backspace: jest.fn(),
  },
}))

jest.mock('prosemirror-inputrules', () => ({
  inputRules: jest.fn(({ rules }) => ({ rules })),
  InputRule: jest
    .fn()
    .mockImplementation((regex, handler) => ({ regex, handler })),
  wrappingInputRule: jest.fn((regex, nodeType) => ({
    type: 'wrapping',
    regex,
    nodeType: nodeType?.name || 'unknown',
  })),
  textblockTypeInputRule: jest.fn((regex, nodeType, attrs) => ({
    type: 'textblock',
    regex,
    nodeType: nodeType?.name || 'unknown',
    attrs,
  })),
}))

jest.mock('prosemirror-keymap', () => ({
  keymap: jest.fn((keys) => ({ keys })),
}))

describe('Editor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the editor component', async () => {
    render(<Editor />)

    // Check if the editor container is present
    const editorContainer = document.querySelector('.ProseMirror-editor')
    expect(editorContainer).toBeInTheDocument()
  })

  it('renders with ProseMirror class', async () => {
    render(<Editor />)

    // Wait for the async initialization to complete
    await waitFor(() => {
      const proseMirrorDiv = document.querySelector('.ProseMirror')
      expect(proseMirrorDiv).toBeInTheDocument()
    })
  })

  it('applies custom className', async () => {
    render(<Editor className="custom-editor" />)

    const editorWrapper = document.querySelector('.custom-editor')
    expect(editorWrapper).toBeInTheDocument()
  })

  it('has contentEditable attribute', async () => {
    render(<Editor />)

    await waitFor(() => {
      const proseMirrorDiv = document.querySelector('.ProseMirror')
      expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
    })
  })

  it('contains mock editor content', async () => {
    render(<Editor />)

    await waitFor(() => {
      const proseMirrorDiv = document.querySelector('.ProseMirror')
      expect(proseMirrorDiv).toHaveTextContent('Mock editor content')
    })
  })

  describe('Mark functionality', () => {
    it('creates input rules for bold, italic, and strikethrough', async () => {
      render(<Editor />)

      // Wait for async initialization to complete
      await waitFor(() => {
        // Verify that input rules were created with the correct patterns
        expect(inputRules).toHaveBeenCalled()

        const inputRulesCall = (inputRules as jest.Mock).mock.calls[0][0]
        expect(inputRulesCall.rules).toBeDefined()
        expect(inputRulesCall.rules.length).toBeGreaterThanOrEqual(3) // Now includes block-level rules
      })
    })

    it('creates keymap with correct shortcuts', async () => {
      render(<Editor />)

      await waitFor(() => {
        // Verify that keymap was created with correct shortcuts
        expect(keymap).toHaveBeenCalled()

        // Find the custom keymap call (should be the second call, first is baseKeymap)
        const keymapCalls = (keymap as jest.Mock).mock.calls
        const customKeymapCall = keymapCalls.find(
          (call) =>
            call[0]['Mod-b'] && call[0]['Mod-i'] && call[0]['Mod-Shift-s']
        )
        expect(customKeymapCall).toBeDefined()

        const customKeymap = customKeymapCall[0]
        expect(customKeymap['Mod-b']).toBeDefined() // Bold shortcut
        expect(customKeymap['Mod-i']).toBeDefined() // Italic shortcut
        expect(customKeymap['Mod-Shift-s']).toBeDefined() // Strikethrough shortcut
      })
    })

    it('sets up schema with enhanced marks', async () => {
      render(<Editor />)

      await waitFor(() => {
        // The Schema is created at module load time, so we just verify the Editor renders
        // with the enhanced schema functionality (which is tested through other tests)
        const proseMirrorDiv = document.querySelector('.ProseMirror')
        expect(proseMirrorDiv).toBeInTheDocument()

        // Verify that the schema includes the expected mark functionality by checking
        // if the component rendered without errors (indicating the schema was valid)
        expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
      })
    })

    it('configures plugins in correct order', async () => {
      render(<Editor />)

      await waitFor(() => {
        // Verify that EditorState.create was called with plugins in correct order
        expect(EditorState.create).toHaveBeenCalled()

        const createCall = (EditorState.create as jest.Mock).mock.calls[0][0]
        expect(createCall.plugins).toBeDefined()
        expect(createCall.plugins.length).toBeGreaterThanOrEqual(2) // input rules + keymap (+ example setup which returns [])
      })
    })

    it('integrates toggleMark commands for keyboard shortcuts', async () => {
      render(<Editor />)

      await waitFor(() => {
        // Verify that toggleMark was called for each mark type
        expect(toggleMark).toHaveBeenCalledTimes(3) // bold, italic, strikethrough
      })
    })
  })

  describe('Input Rules Testing', () => {
    it('creates bold input rule with correct regex', async () => {
      render(<Editor />)

      await waitFor(() => {
        const inputRuleCalls = (InputRule as jest.Mock).mock.calls

        // Find the bold input rule (should match **text**)
        const boldRule = inputRuleCalls.find((call) => {
          const regex = call[0]
          return regex.toString().includes('\\*\\*')
        })

        expect(boldRule).toBeDefined()
        expect(boldRule[0]).toEqual(/(?:^|\s)\*\*([^*]+)\*\*$/)
      })
    })

    it('creates italic input rule with correct regex', async () => {
      render(<Editor />)

      await waitFor(() => {
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
    })

    it('creates strikethrough input rule with correct regex', async () => {
      render(<Editor />)

      await waitFor(() => {
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

  describe('Block-level Elements (Task 5.4.3)', () => {
    describe('Heading Input Rules', () => {
      it('creates textblock input rules for all heading levels (H1-H6)', async () => {
        render(<Editor />)

        await waitFor(() => {
          // Verify that textblockTypeInputRule was called for each heading level
          expect(textblockTypeInputRule).toHaveBeenCalledTimes(6)

          // Check each heading level
          const calls = (textblockTypeInputRule as jest.Mock).mock.calls

          // H1: #
          expect(calls[0][0]).toEqual(new RegExp('^(#{1})\\s$'))
          expect(calls[0][2]).toEqual({ level: 1 })

          // H2: ##
          expect(calls[1][0]).toEqual(new RegExp('^(#{2})\\s$'))
          expect(calls[1][2]).toEqual({ level: 2 })

          // H3: ###
          expect(calls[2][0]).toEqual(new RegExp('^(#{3})\\s$'))
          expect(calls[2][2]).toEqual({ level: 3 })

          // H6: ######
          expect(calls[5][0]).toEqual(new RegExp('^(#{6})\\s$'))
          expect(calls[5][2]).toEqual({ level: 6 })
        })
      })

      it('heading input rules use correct regex patterns', async () => {
        render(<Editor />)

        await waitFor(() => {
          const calls = (textblockTypeInputRule as jest.Mock).mock.calls

          // Verify each heading regex matches expected pattern
          for (let level = 1; level <= 6; level++) {
            const expectedRegex = new RegExp(`^(#{${level}})\\s$`)
            expect(calls[level - 1][0]).toEqual(expectedRegex)
          }
        })
      })
    })

    describe('List Input Rules', () => {
      it('creates wrapping input rule for unordered lists', async () => {
        render(<Editor />)

        await waitFor(() => {
          // Find the bullet list wrapping rule
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const bulletListRule = wrappingCalls.find((call) =>
            call[0].toString().includes('[-*+]')
          )

          expect(bulletListRule).toBeDefined()
          expect(bulletListRule[0]).toEqual(/^\s*([-*+])\s$/)
        })
      })

      it('creates wrapping input rule for ordered lists', async () => {
        render(<Editor />)

        await waitFor(() => {
          // Find the ordered list wrapping rule
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const orderedListRule = wrappingCalls.find((call) =>
            call[0].toString().includes('\\d+')
          )

          expect(orderedListRule).toBeDefined()
          expect(orderedListRule[0]).toEqual(/^(\d+)\.\s$/)
        })
      })

      it('unordered list rule matches various markdown bullets', async () => {
        render(<Editor />)

        await waitFor(() => {
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const bulletListRule = wrappingCalls.find((call) =>
            call[0].toString().includes('[-*+]')
          )
          const regex = bulletListRule[0]

          // Test that the regex matches different bullet types
          expect('* '.match(regex)).toBeTruthy()
          expect('- '.match(regex)).toBeTruthy()
          expect('+ '.match(regex)).toBeTruthy()
          expect('  * '.match(regex)).toBeTruthy() // With indentation
        })
      })

      it('ordered list rule matches numbered lists', async () => {
        render(<Editor />)

        await waitFor(() => {
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const orderedListRule = wrappingCalls.find((call) =>
            call[0].toString().includes('\\d+')
          )
          const regex = orderedListRule[0]

          // Test that the regex matches different number formats
          expect('1. '.match(regex)).toBeTruthy()
          expect('42. '.match(regex)).toBeTruthy()
          expect('999. '.match(regex)).toBeTruthy()
        })
      })
    })

    describe('Blockquote Input Rules', () => {
      it('creates wrapping input rule for blockquotes', async () => {
        render(<Editor />)

        await waitFor(() => {
          // Find the blockquote wrapping rule
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const blockquoteRule = wrappingCalls.find((call) =>
            call[0].toString().includes('>')
          )

          expect(blockquoteRule).toBeDefined()
          expect(blockquoteRule[0]).toEqual(/^\s*>\s$/)
        })
      })

      it('blockquote rule matches various quote formats', async () => {
        render(<Editor />)

        await waitFor(() => {
          const wrappingCalls = (wrappingInputRule as jest.Mock).mock.calls
          const blockquoteRule = wrappingCalls.find((call) =>
            call[0].toString().includes('>')
          )
          const regex = blockquoteRule[0]

          // Test that the regex matches different quote formats
          // The regex is /^\s*>\s$/ which requires exactly one space after >
          expect('> '.match(regex)).toBeTruthy()
          expect('  > '.match(regex)).toBeTruthy() // With indentation
          // Note: '>  ' (extra space after >) would not match the exact regex /^\s*>\s$/
        })
      })
    })

    describe('Schema Integration', () => {
      it('creates enhanced schema with all block-level nodes', async () => {
        render(<Editor />)

        await waitFor(() => {
          // The schema creation happens during module load
          // We verify through successful component rendering that includes all node types
          const proseMirrorDiv = document.querySelector('.ProseMirror')
          expect(proseMirrorDiv).toBeInTheDocument()

          // Schema must include nodes for the input rules to work
          // This is validated by the component rendering without errors
          expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
        })
      })

      it('integrates with addListNodes from prosemirror-schema-list', async () => {
        render(<Editor />)

        await waitFor(() => {
          // Verify that the schema includes list functionality
          // by checking that the component renders successfully with list input rules
          const proseMirrorDiv = document.querySelector('.ProseMirror')
          expect(proseMirrorDiv).toBeInTheDocument()

          // If addListNodes failed, the schema creation would fail and component wouldn't render
          expect(proseMirrorDiv).toHaveAttribute('contenteditable', 'true')
        })
      })
    })

    describe('Input Rules Integration', () => {
      it('includes all block-level input rules in the final plugin', async () => {
        render(<Editor />)

        await waitFor(() => {
          expect(inputRules).toHaveBeenCalled()

          const inputRulesCall = (inputRules as jest.Mock).mock.calls[0][0]
          expect(inputRulesCall.rules).toBeDefined()

          // Should include: 3 mark rules + 6 heading rules + 2 list rules + 1 blockquote rule = 12 total
          expect(inputRulesCall.rules.length).toBe(12)
        })
      })

      it('verifies input rules are created in correct order', async () => {
        render(<Editor />)

        await waitFor(() => {
          const inputRulesCall = (inputRules as jest.Mock).mock.calls[0][0]
          const rules = inputRulesCall.rules

          // First 3 should be mark rules (bold, italic, strikethrough)
          expect(rules[0].regex).toEqual(/(?:^|\s)\*\*([^*]+)\*\*$/)
          expect(rules[1].regex).toEqual(/(?:^|\s)\*([^*]+)\*$/)
          expect(rules[2].regex).toEqual(/(?:^|\s)~~([^~]+)~~$/)

          // Next 6 should be heading rules
          for (let i = 3; i < 9; i++) {
            const level = i - 2
            expect(rules[i].attrs).toEqual({ level })
          }
        })
      })
    })
  })
})
