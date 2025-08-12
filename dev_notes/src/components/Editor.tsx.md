# File: src/components/Editor.tsx

## 1. File-Level Overview

- Module Purpose: A ProseMirror-based WYSIWYG editor React component with custom marks, input rules (Markdown-like), and keybindings.
- Role in Project: Core UI component for authoring Markdown-like rich text; part of the presentation layer with behavior.
- Key Dependencies:
  - `react`: Hooks `useEffect`, `useRef` to manage editor lifecycle and refs.
  - `prosemirror-*` packages: `state`, `view`, `model`, `schema-basic`, `schema-list`, `example-setup`, `inputrules`, `keymap`, `commands` for editor behavior.

## 2. Global Variables and Definitions

- `basicMarks: any` — Customized marks config overriding `strong`, `em`, and adding `strikethrough` with improved DOM parsing/serialization.
- `mySchema: Schema` — ProseMirror schema combining basic nodes with list nodes and custom marks.

## 3. Detailed Breakdown of Functions and Components

### Function: `createInputRules(schema: Schema)`

- Functionality: Returns a plugin that transforms simple Markdown syntax typed by the user into rich marks (bold, italic, strikethrough).
- Parameters:
  - `schema: Schema` (required) — ProseMirror schema providing mark types.
- Return Value:
  - Type: `Plugin` from `prosemirror-inputrules`.
  - Description: Handles three regex-based replacements when text matches specific patterns.
- Core Implementation Logic:
  1. Start with an empty `rules` array.
  2. Push input rules:
     - Bold: `/(?:^|\s)\*\*([^*]+)\*\*$/` → wrap captured text with `strong` mark.
     - Italic: `/(?:^|\s)\*([^*]+)\*$/` → wrap with `em` mark.
     - Strikethrough: `/(?:^|\s)~~([^~]+)~~$/` → wrap with `strikethrough` mark.
  3. Each handler replaces the matched range with a new `TextNode` carrying the respective mark.
  4. Return `inputRules({ rules })` plugin.
- Example Usage:
  - Internal to `EditorState.create({ plugins: [createInputRules(mySchema), ...] })`.

### Function: `createKeymap(schema: Schema)`

- Functionality: Produces a keymap plugin mapping standard shortcuts to mark toggles.
- Parameters:
  - `schema: Schema` (required)
- Return Value: `Plugin` from `prosemirror-keymap`.
- Core Implementation Logic:
  1. Define mapping object `keys`.
  2. Map:
     - `'Mod-b'` → `toggleMark(schema.marks.strong)`
     - `'Mod-i'` → `toggleMark(schema.marks.em)`
     - `'Mod-Shift-s'` → `toggleMark(schema.marks.strikethrough)` if present
  3. Return `keymap(keys)`.
- Example Usage:
  - Included in `EditorState` plugins.

### Component: `Editor(props: EditorProps)`

- Functionality: Mounts a ProseMirror editor view, wires input rules, keymap, example setup, and emits HTML on changes.
- Parameters (EditorProps):
  - `className?: string` (optional, default `''`) — Additional CSS classes for outer wrapper.
  - `initialContent?: string` (optional, default `''`) — Initial HTML string to parse into the document.
  - `onChange?: (content: string) => void` (optional) — Callback invoked with the current HTML when the document changes.
- Return Value:
  - Type: `JSX.Element`
- Core Implementation Logic:
  1. Create `editorRef` for the DOM mount node; `viewRef` to hold `EditorView`.
  2. In `useEffect`:
     - Parse `initialContent` (if any) to a ProseMirror `doc` via `DOMParser.fromSchema(mySchema)`; else create an empty doc.
     - Create `EditorState` using `createInputRules`, `createKeymap`, and `exampleSetup` plugins (history enabled, menu bars disabled).
     - Instantiate `EditorView` bound to `editorRef.current` with `dispatchTransaction` updating state and invoking `onChange` when `transaction.docChanged`.
     - Store the view in `viewRef`.
     - Cleanup: destroy view on unmount.
  3. Render a wrapper with `.ProseMirror-editor` container which `EditorView` will populate.
- Example Usage:
  ```tsx
  <Editor
    className="h-full"
    initialContent="<p>Hello <strong>world</strong></p>"
    onChange={(html) => console.log(html)}
  />
  ```

## 4. Overall Logic & Interaction

`Editor` creates a ProseMirror instance configured with custom marks, markdown-like input rules, and common keybindings. The component translates between HTML strings and ProseMirror docs, surfaces changes via `onChange`, and acts as the central editing surface in the app’s main page.
