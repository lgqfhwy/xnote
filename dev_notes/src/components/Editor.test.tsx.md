# File: src/components/Editor.test.tsx

## 1. File-Level Overview

- Module Purpose: Unit tests for the `Editor` component’s rendering and ProseMirror integration hooks (input rules, keymap, schema).
- Role in Project: Ensures editor UI mounts correctly and internal plugin wiring is invoked.
- Key Dependencies:
  - `@testing-library/react`, `@testing-library/jest-dom`: For rendering and DOM assertions.
  - ProseMirror packages: mocked to control behavior and observe configuration.

## 2. Global Variables and Definitions

- `mockEditorView`: Captures the mocked `EditorView` instance.
- `mockState`: Captures the mocked `EditorState` instance created during tests.

## 3. Detailed Breakdown of Tests

### Suite: `describe('Editor', ...)`

- Functionality: Validates rendering, classNames, contenteditable, plugin setup, and shortcuts.

#### Test: renders the editor component

- Verifies `.ProseMirror-editor` container exists after render.

#### Test: renders with ProseMirror class

- Ensures the mocked `.ProseMirror` element is inserted by the mocked view.

#### Test: applies custom className

- Renders with `className="custom-editor"` and expects it on the wrapper.

#### Test: has contentEditable attribute

- Confirms the ProseMirror element is contenteditable.

#### Test: contains mock editor content

- Confirms mock HTML was inserted by the mocked `EditorView`.

### Mark functionality tests

- `creates input rules for bold, italic, and strikethrough`: Asserts `inputRules` called with 3 rules.
- `creates keymap with correct shortcuts`: Asserts `Mod-b`, `Mod-i`, and `Mod-Shift-s` are provided.
- `sets up schema with enhanced marks`: Smoke test asserting component rendered with valid schema.
- `configures plugins in correct order`: Checks `EditorState.create` called and plugin array length.
- `integrates toggleMark commands for keyboard shortcuts`: Ensures `toggleMark` called three times.

### Input Rules Testing

- Validates the regex patterns passed to `InputRule` for bold, italic, and strikethrough.

## 4. Overall Logic & Interaction

The test suite mocks ProseMirror to isolate UI behavior and verify the editor’s configuration pipeline: schema creation, plugin composition, and keyboard shortcut mapping. This guards against regressions in editor wiring without requiring a full ProseMirror environment.
