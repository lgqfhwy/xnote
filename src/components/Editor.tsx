'use client'

import { useEffect, useRef } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'

// Create schema with list support
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
})

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
        history(),
        keymap(baseKeymap),
        ...exampleSetup({
          schema: mySchema,
          menuBar: false,
          floatingMenu: false,
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
