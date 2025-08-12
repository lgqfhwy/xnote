# File: src/components/UserInfo.tsx

## 1. File-Level Overview

- Module Purpose: Displays current authenticated user info and provides a sign-out action.
- Role in Project: UI component bound to Supabase auth state; presentation + light auth control.
- Key Dependencies:
  - `@supabase/auth-helpers-nextjs`: `createClientComponentClient` to access auth APIs on the client.
  - `react`: `useEffect`, `useState` for managing async auth state and reactivity.
  - `@supabase/supabase-js`: `User` type for state typing.

## 2. Global Variables and Definitions

- Local state:
  - `user: User | null` — Current authenticated user instance.
  - `loading: boolean` — Indicates whether auth state is being resolved.

## 3. Detailed Breakdown of Functions and Components

### Component: `UserInfo()`

- Functionality: Fetches the current user, listens for auth state changes, renders user email or sign-in status, and allows sign-out.
- Parameters: None.
- Return Value: `JSX.Element` reflecting loading state, unauthenticated state, or user details with a sign-out button.
- Core Implementation Logic:
  1. Initialize Supabase client with `createClientComponentClient()`.
  2. On mount, call `supabase.auth.getUser()` to fetch the current user; set `user` and `loading` accordingly.
  3. Subscribe to `supabase.auth.onAuthStateChange` to react to sign-in/sign-out events and update `user`/`loading`.
  4. Cleanup subscription on unmount.
  5. Provide `handleSignOut` calling `supabase.auth.signOut()`.
  6. Render:
     - Loading text while `loading` is true.
     - "Not signed in" if `user` is null.
     - User email and a Sign Out button when authenticated.
- Example Usage:

  ```tsx
  import { UserInfo } from '@/components/UserInfo'

  export default function HeaderRight() {
    return <UserInfo />
  }
  ```

## 4. Overall Logic & Interaction

`UserInfo` is a small reactive UI binding to Supabase auth. It initializes, resolves the current user, listens for auth state changes, and offers a sign-out action. It complements routing/middleware that protects pages by reflecting the user’s session state.
