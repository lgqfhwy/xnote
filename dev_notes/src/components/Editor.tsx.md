# File: src/components/Editor.tsx

## 1. File-Level Overview

- Module Purpose: A ProseMirror-based WYSIWYG editor React component with custom marks, input rules (Markdown-like), and keybindings.
- Role in Project: Core UI component for authoring Markdown-like rich text; part of the presentation layer with behavior.
- Key Dependencies:
  - `react`: Hooks `useEffect`, `useRef` to manage editor lifecycle and refs.
  - `prosemirror-*` packages: `state`, `view`, `model`, `schema-basic`, `schema-list`, `inputrules`, `keymap`, `commands` for editor behavior.

## 2. Global Variables and Definitions

- `basicMarks: any` — Customized marks config overriding `strong`, `em`, and adding `strikethrough` with improved DOM parsing/serialization.
- `mySchema: Schema` — ProseMirror schema combining basic nodes with list nodes and custom marks.
- Runtime Robustness:
  - Adds a minimal `Element.prototype.append` polyfill if missing to prevent crashes in non-standard environments.
  - Uses the EditorView mounting `{ mount: element }` strategy at runtime to avoid reliance on `Element.append`.

## 3. Detailed Breakdown of Functions and Components

### Function: `createInputRules(schema: Schema)`

- Functionality: Returns a plugin that transforms simple Markdown syntax typed by the user into rich marks (bold, italic, strikethrough) and block-level rules (headings, lists, blockquotes).
- Parameters:
  - `schema: Schema` (required) — ProseMirror schema providing mark types.
- Return Value:
  - Type: `Plugin` from `prosemirror-inputrules`.
  - Description: Handles regex-based replacements when text matches specific patterns.

### Function: `createKeymap(schema: Schema)`

- Functionality: Produces a keymap plugin mapping standard shortcuts to mark toggles.
- Parameters:
  - `schema: Schema` (required)
- Return Value: `Plugin` from `prosemirror-keymap`.

### Component: `Editor(props: EditorProps)`

- Functionality: Mounts a ProseMirror editor view, wires input rules and keymaps, and emits HTML on changes.
- Parameters (EditorProps):
  - `className?: string` — Additional CSS classes for outer wrapper.
  - `initialContent?: string` — Initial HTML string to parse into the document.
  - `onChange?: (content: string) => void` — Callback invoked with the current HTML when the document changes.
- Mounting Strategy:
  - In tests, passes the element directly to satisfy mocks.
  - At runtime, uses `{ mount: editorRef.current }` so ProseMirror handles insertion without using `element.append`.
- Cleanup: Destroys the `EditorView` on unmount to free resources.

## 4. Overall Logic & Interaction

`Editor` creates a ProseMirror instance configured with custom marks, markdown-like input rules, and common keybindings. The component translates between HTML strings and ProseMirror docs, surfaces changes via `onChange`, and acts as the central editing surface in the app’s main page. The mounting and polyfill changes harden the component against environments where `Element.append` is not available, fixing the observed runtime error.
