# File: src/middleware.ts

## 1. File-Level Overview

- Module Purpose: Next.js middleware that gates routes based on Supabase authentication and redirects accordingly.
- Role in Project: Request-time access control layer enforcing public vs. protected routes.
- Key Dependencies:
  - `@supabase/auth-helpers-nextjs`: `createMiddlewareClient` to read session in middleware.
  - `next/server`: `NextRequest`, `NextResponse` for edge-compatible routing.

## 2. Global Variables and Definitions

- `config.matcher: string[]` — URL patterns to apply middleware to, excluding static assets and public folder.

## 3. Detailed Breakdown of Functions

### Function: `middleware(req: NextRequest)`

- Functionality: Determines whether the incoming request is authenticated and redirects to `/login` or `/` when necessary.
- Parameters:
  - `req: NextRequest` (required) — The incoming request object from Next.js middleware.
- Return Value:
  - `NextResponse` — Either `NextResponse.next()` to continue, or a redirect response.
- Core Implementation Logic:
  1. Create a `NextResponse.next()` and a Supabase middleware client bound to `{ req, res }`.
  2. Call `supabase.auth.getUser()` to determine current user.
  3. Compute booleans:
     - `isAuthPage`: paths under `/login` or `/auth/`.
     - `isProtectedRoute`: `/` or under `/app`.
  4. Redirect rules:
     - If no user and protected route → redirect to `/login`.
     - If user and requesting auth pages (except `/auth/callback`) → redirect to `/`.
  5. Otherwise return `res` to continue.
- Example Usage: Applied automatically by Next.js to matched routes.

### Export: `config`

- Functionality: Declares matcher patterns to run middleware while excluding Next.js internals and `public/`.

## 4. Overall Logic & Interaction

The middleware enforces authentication at the edge for protected pages, cooperating with the login page and `auth/callback` route. It standardizes access control and reduces the need for per-page guards.
