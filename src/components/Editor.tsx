'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
import {
  inputRules,
  InputRule,
  wrappingInputRule,
  textblockTypeInputRule,
} from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { toggleMark } from 'prosemirror-commands'

// Function to create schema lazily on client side
function createEditorSchema() {
  // Create basic marks object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const basicMarks: any = {
    // Override strong mark with better DOM specification
    strong: {
      parseDOM: [
        { tag: 'strong' },
        {
          tag: 'b',
          getAttrs: (node: HTMLElement) =>
            node.style.fontWeight !== 'normal' && null,
        },
        {
          style: 'font-weight',
          getAttrs: (value: string) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM() {
        return ['strong', 0]
      },
    },
    // Override em mark
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0]
      },
    },
    // Add strikethrough mark
    strikethrough: {
      parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { style: 'text-decoration=line-through' },
      ],
      toDOM() {
        return ['s', 0]
      },
    },
  }

  // Add existing marks if available
  if (schema.spec.marks.get && schema.spec.marks.get('link')) {
    basicMarks.link = schema.spec.marks.get('link')
  }
  if (schema.spec.marks.get && schema.spec.marks.get('code')) {
    basicMarks.code = schema.spec.marks.get('code')
  }

  // Create enhanced nodes object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const basicNodes: any = {}

  // Add base nodes from the schema
  if (schema.spec.nodes.get) {
    // Runtime environment - use get method
    basicNodes.doc = schema.spec.nodes.get('doc')
    basicNodes.paragraph = schema.spec.nodes.get('paragraph')
    basicNodes.text = schema.spec.nodes.get('text')
  } else {
    // Test environment - direct access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = schema.spec.nodes as any
    basicNodes.doc = nodes.doc
    basicNodes.paragraph = nodes.paragraph
    basicNodes.text = nodes.text
  }

  // Add enhanced nodes
  basicNodes.heading = {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toDOM(node: any) {
      return ['h' + node.attrs.level, 0]
    },
  }

  basicNodes.blockquote = {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return ['blockquote', 0]
    },
  }

  basicNodes.hard_break = {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return ['br']
    },
  }

  // Add list nodes using prosemirror-schema-list
  const nodesWithLists = addListNodes(basicNodes, 'paragraph block*', 'block')

  // Create custom schema with enhanced nodes and marks
  return new Schema({
    nodes: nodesWithLists,
    marks: basicMarks,
  })
}

// Input rules for markdown syntax
function createInputRules(schema: Schema) {
  const rules = []

  // Bold: **text** -> <strong>text</strong>
  rules.push(
    new InputRule(
      /(?:^|\s)\*\*([^*]+)\*\*$/,
      (state: EditorState, match: string[], start: number, end: number) => {
        const mark = schema.marks.strong.create()
        const text = schema.text(match[1], [mark])
        return state.tr.replaceWith(
          start + (match[0].startsWith(' ') ? 1 : 0),
          end,
          text
        )
      }
    )
  )

  // Italic: *text* -> <em>text</em>
  rules.push(
    new InputRule(
      /(?:^|\s)\*([^*]+)\*$/,
      (state: EditorState, match: string[], start: number, end: number) => {
        const mark = schema.marks.em.create()
        const text = schema.text(match[1], [mark])
        return state.tr.replaceWith(
          start + (match[0].startsWith(' ') ? 1 : 0),
          end,
          text
        )
      }
    )
  )

  // Strikethrough: ~~text~~ -> <s>text</s>
  rules.push(
    new InputRule(
      /(?:^|\s)~~([^~]+)~~$/,
      (state: EditorState, match: string[], start: number, end: number) => {
        const mark = schema.marks.strikethrough.create()
        const text = schema.text(match[1], [mark])
        return state.tr.replaceWith(
          start + (match[0].startsWith(' ') ? 1 : 0),
          end,
          text
        )
      }
    )
  )

  // Headings: # ## ### #### ##### ###### -> <h1> <h2> etc.
  for (let level = 1; level <= 6; level++) {
    rules.push(
      textblockTypeInputRule(
        new RegExp(`^(#{${level}})\\s$`),
        schema.nodes.heading,
        { level }
      )
    )
  }

  // Unordered list: * - + -> <ul><li>
  if (schema.nodes.bullet_list) {
    rules.push(wrappingInputRule(/^\s*([-*+])\s$/, schema.nodes.bullet_list))
  }

  // Ordered list: 1. 2. etc. -> <ol><li>
  if (schema.nodes.ordered_list) {
    rules.push(wrappingInputRule(/^(\d+)\.\s$/, schema.nodes.ordered_list))
  }

  // Blockquote: > -> <blockquote>
  if (schema.nodes.blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote))
  }

  return inputRules({ rules })
}

// Keymap for shortcuts
function createKeymap(schema: Schema) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keys: Record<string, any> = {}

  // Bold: Ctrl+B
  keys['Mod-b'] = toggleMark(schema.marks.strong)

  // Italic: Ctrl+I
  keys['Mod-i'] = toggleMark(schema.marks.em)

  // Strikethrough: Ctrl+Shift+S (if mark exists)
  if (schema.marks.strikethrough) {
    keys['Mod-Shift-s'] = toggleMark(schema.marks.strikethrough)
  }

  return keymap(keys)
}

export interface EditorProps {
  className?: string
  initialContent?: string
  onChange?: (content: string) => void
}

export function Editor({
  className = '',
  initialContent = '',
  onChange,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !editorRef.current) return

    // Create schema on client side
    const mySchema = createEditorSchema()

    // Create initial document
    let doc
    if (initialContent) {
      const element = document.createElement('div')
      element.innerHTML = initialContent
      doc = DOMParser.fromSchema(mySchema).parse(element)
    } else {
      doc = mySchema.nodes.doc.createAndFill()!
    }

    // Create editor state
    const state = EditorState.create({
      doc,
      plugins: [
        createInputRules(mySchema),
        createKeymap(mySchema),
        ...exampleSetup({
          schema: mySchema,
          menuBar: false,
          floatingMenu: false,
          history: true, // This enables history in exampleSetup
        }),
      ],
    })

    // Create editor view
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction)
        view.updateState(newState)

        // Call onChange if provided
        if (onChange && transaction.docChanged) {
          const content = view.dom.innerHTML
          onChange(content)
        }
      },
    })

    viewRef.current = view

    // Cleanup function
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [isClient, initialContent, onChange])

  if (!isClient) {
    return (
      <div className={`prose max-w-none ${className}`}>
        <div className="ProseMirror-editor min-h-[200px] rounded-md border border-gray-200 p-4">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`prose max-w-none ${className}`}>
      <div
        ref={editorRef}
        className="ProseMirror-editor min-h-[200px] rounded-md border border-gray-200 p-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      />
    </div>
  )
}
