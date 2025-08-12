# File: src/app/auth/callback/route.ts

## 1. File-Level Overview

- Module Purpose: Server route handler that completes the Supabase OAuth flow by exchanging the code for a session and then redirects.
- Role in Project: Part of authentication backend integration; finalizes login and ensures the user session is established.
- Key Dependencies:
  - `@supabase/auth-helpers-nextjs`: `createRouteHandlerClient` to perform server-side auth operations.
  - `next/headers`: `cookies` to access and set auth cookies.
  - `next/server`: `NextRequest`, `NextResponse` for route handling.

## 2. Global Variables and Definitions

- `runtime = 'nodejs'` — Runs this route in the Node.js runtime (not edge) to ensure compatibility.

## 3. Detailed Breakdown of Functions

### Function: `GET(request: NextRequest)`

- Functionality: Reads the `code` parameter from the URL, exchanges it for a session via Supabase, handles errors, and redirects to `/`.
- Parameters:
  - `request: NextRequest` (required) — Incoming request.
- Return Value:
  - `NextResponse` — Redirect to `/` on success; redirect to `/login?error=...` on failure.
- Core Implementation Logic:
  1. Parse the incoming URL and extract `code`.
  2. If `code` exists:
     - Create a route handler Supabase client using the cookie store.
     - Call `supabase.auth.exchangeCodeForSession(code)`.
     - If error occurs, log and redirect to `/login` with error query.
  3. Redirect to `/` regardless (success path will have session set by Supabase).
- Example Usage: This handler is invoked by the Supabase Auth `redirectTo` URL.

## 4. Overall Logic & Interaction

This route completes the OAuth login initiated on the login page. It sets user cookies server-side and returns the user to the main app, where middleware and UI will treat them as authenticated.
