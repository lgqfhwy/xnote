# File: src/app/(auth)/login/page.tsx

## 1. File-Level Overview

- Module Purpose: Client-side login page that renders Supabase Auth UI and handles redirect/session checks.
- Role in Project: Authentication route; part of the app’s auth flow separate from the main app shell.
- Key Dependencies:
  - `@supabase/auth-helpers-nextjs`: Client helper to access `supabase.auth` in the browser.
  - `@supabase/auth-ui-react` and `@supabase/auth-ui-shared`: Prebuilt auth components and theming.
  - `next/navigation`: Router for client-side navigation after login.
  - React hooks for lifecycle and state.

## 2. Global Variables and Definitions

- `dynamic: 'force-dynamic'` — Disable static generation to avoid session mismatch and ensure live auth behavior.
- Local state:
  - `redirectUrl: string` — Computed callback URL, set to `${window.location.origin}/auth/callback`.

## 3. Detailed Breakdown of Components and Functions

### Component: `LoginPage()` (default export)

- Functionality: Renders `Auth` component configured for GitHub and Google; listens for sign-in events and redirects to home.
- Parameters: None.
- Return Value: `JSX.Element` with centered auth UI.
- Core Implementation Logic:
  1. Create Supabase client: `createClientComponentClient()`.
  2. On mount:
     - Set `redirectUrl` to absolute callback URL.
     - Subscribe to `onAuthStateChange`; when `SIGNED_IN`, `router.push('/')`.
     - Check existing session via `getSession()`; if present, redirect to `/`.
     - Cleanup subscription on unmount.
  3. Render `<Auth>` with providers `['github', 'google']`, ThemeSupa appearance, and `redirectTo={redirectUrl}`.
- Example Usage: Served at `/login`.

## 4. Overall Logic & Interaction

This page owns the user sign-in experience. It defers credential UI to Supabase’s library, wiring session lifecycle to Next.js navigation and a dedicated server callback route.
