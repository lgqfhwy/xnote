# File: src/app/page.tsx

## 1. File-Level Overview

- Module Purpose: Renders the main authenticated application shell with top bar, sidebar (resizable), editor area, and status bar.
- Role in Project: Primary UI route for the app’s core editing experience; presentation layer.
- Key Dependencies:
  - Local components: `TopBar`, `Sidebar`, `StatusBar`, `Editor` for layout and editing.
  - React: `useState` for UI state (sidebar visibility and width).

## 2. Global Variables and Definitions

- `dynamic: 'force-dynamic'` — Disables static generation for auth-protected client page.
- Local state:
  - `sidebarVisible: boolean` — Whether the sidebar is shown; defaults to `true`.
  - `sidebarWidth: number` — Width of the sidebar in px; defaults to `250`.

## 3. Detailed Breakdown of Components and Functions

### Component: `Home()` (default export)

- Functionality: Coordinates layout regions and manages sidebar state; embeds the rich text `Editor`.
- Parameters: None.
- Return Value: `JSX.Element` with header, body (sidebar + editor), and footer.
- Core Implementation Logic:
  1. Initialize `sidebarVisible` and `sidebarWidth` via `useState`.
  2. Define `toggleSidebar` to flip `sidebarVisible`.
  3. Render layout:
     - `<TopBar onToggleSidebar={toggleSidebar} />` to control sidebar.
     - `<Sidebar isVisible width onWidthChange>` controlled by state.
     - `<main>` containing welcoming content and `<Editor>` with HTML `initialContent`.
     - `<StatusBar />` footer.
- Example Usage: Rendered automatically by Next.js at route `/`.

## 4. Overall Logic & Interaction

`Home` composes the app shell, passing handlers and state to child components. User interactions in `TopBar` and `Sidebar` update local state, which re-renders the controlled `Sidebar` and keeps the main editor area responsive.
