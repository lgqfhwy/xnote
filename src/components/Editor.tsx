'use client'

import { useEffect, useRef } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
import { inputRules, InputRule } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { toggleMark } from 'prosemirror-commands'

// Create custom schema with enhanced marks
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: {
    // Use existing marks but override specific ones
    link: schema.spec.marks.get('link')!,
    code: schema.spec.marks.get('code')!,
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
  },
})

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

  useEffect(() => {
    if (!editorRef.current) return

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
  }, [initialContent, onChange])

  return (
    <div className={`prose max-w-none ${className}`}>
      <div
        ref={editorRef}
        className="ProseMirror-editor min-h-[200px] rounded-md border border-gray-200 p-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      />
    </div>
  )
}
