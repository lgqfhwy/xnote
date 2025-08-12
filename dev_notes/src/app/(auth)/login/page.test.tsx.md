# File: src/app/(auth)/login/page.test.tsx

## 1. File-Level Overview

- Module Purpose: Tests the login page renders core elements and third-party social buttons.
- Role in Project: UI tests for the authentication entry point.
- Key Dependencies:
  - `@testing-library/react`, `@testing-library/jest-dom`.
  - Jest mocks for Supabase auth helpers, Next.js router, and Supabase Auth UI.

## 2. Global Variables and Definitions

- Mocks window.location and router to keep tests deterministic.

## 3. Detailed Breakdown of Tests

- `renders the login form with email and password inputs` — Ensures form controls are present.
- `displays GitHub and Google social login buttons` — Confirms social providers are rendered.
- `displays the welcome title and description` — Verifies page copy.

## 4. Overall Logic & Interaction

By replacing external integrations with mocks, the tests focus on render output and essential elements, protecting the login UX against regressions.
