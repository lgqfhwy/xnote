# File: src/components/layout/Sidebar.tsx

## 1. File-Level Overview

- Module Purpose: Resizable sidebar UI showing an explorer area, with drag handle to change width.
- Role in Project: Part of the layout/presentation layer; provides navigation chrome akin to an editor's file explorer.
- Key Dependencies:
  - `react`: `useState` to track resize state; event handlers for mouse events.

## 2. Global Variables and Definitions

- Props:
  - `isVisible: boolean` — Whether the sidebar is rendered.
  - `width: number` — Current width in pixels.
  - `onWidthChange: (width: number) => void` — Callback invoked during drag to update width.
- Local state:
  - `isResizing: boolean` — Whether the user is currently dragging the resize handle.

## 3. Detailed Breakdown of Functions and Components

### Component: `Sidebar({ isVisible, width, onWidthChange }: SidebarProps)`

- Functionality: Conditionally renders a sidebar with a drag handle to resize between 200px and 600px.
- Parameters:
  - `isVisible` (boolean, required) — Toggle visibility.
  - `width` (number, required) — Width applied to the sidebar style.
  - `onWidthChange` (function, required) — Receives new width while dragging.
- Return Value: `JSX.Element | null` — Returns `null` when `isVisible` is false.
- Core Implementation Logic:
  1. Manage `isResizing` with mouse down/up to start/stop resizing.
  2. On mouse move while resizing, compute `newWidth = clamp(e.clientX, 200..600)` and call `onWidthChange(newWidth)`.
  3. Add/remove `mousemove` and `mouseup` listeners based on `isResizing` to drive resizing lifecycle.
  4. Render structure:
     - Container `<aside>` with `role="navigation"` and inline width.
     - Content placeholder.
     - Right-aligned 1px handle div; on mousedown toggles `isResizing` and visually highlights while active.
- Example Usage:
  ```tsx
  <Sidebar
    isVisible={visible}
    width={sidebarWidth}
    onWidthChange={setSidebarWidth}
  />
  ```

## 4. Overall Logic & Interaction

The sidebar acts as a controlled component: its width is owned by the parent (`Home` page) and updated via `onWidthChange`. Mouse events govern resizing; the component renders or hides based on `isVisible`.
