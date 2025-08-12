# File: src/app/page.test.tsx

## 1. File-Level Overview

- Module Purpose: Tests the home page layout regions, sidebar toggle behavior, and editor presence.
- Role in Project: UI regression tests ensuring structural elements render and basic interactions work.
- Key Dependencies:
  - `@testing-library/react` and `@testing-library/jest-dom` for rendering and assertions.
  - Jest mocks to replace the heavy `Editor` component with a lightweight stub.

## 2. Global Variables and Definitions

- Window event listener mocks to satisfy JSDOM environment.

## 3. Detailed Breakdown of Tests

- `renders main layout regions with correct ARIA roles` — Asserts presence of `banner`, `navigation`, `main`, `status` regions.
- `sidebar toggle button changes sidebar visibility` — Clicks the toggle button and verifies sidebar hides and reappears.
- `renders welcome content` — Checks the headline and description text.
- `renders the Editor component` — Confirms mocked editor appears and initial content is inserted.

## 4. Overall Logic & Interaction

The test suite validates the home page’s structural integrity and minimal interactivity, catching regressions in layout composition and sidebar state wiring without involving ProseMirror internals.
