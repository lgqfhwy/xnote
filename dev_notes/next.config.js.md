# File: next.config.js

## 1. File-Level Overview

- Module Purpose: Custom Next.js config including client fallbacks, warning suppression, and env propagation.
- Role in Project: Framework/build configuration affecting bundling and runtime env exposure.
- Key Dependencies:
  - `next` runtime consumes this config.

## 2. Global Variables and Definitions

- `nextConfig` — Configuration object with:
  - `serverExternalPackages`: Keeps `@supabase/supabase-js` external on the server.
  - `webpack(config, { isServer })`: Adds browser fallbacks for Node core modules and suppresses known warnings.
  - `env`: Exposes Supabase env vars to client.

## 3. Detailed Breakdown

- Webpack customization:
  1. If client build, set `config.resolve.fallback` for `fs`, `net`, `dns`, `child_process`, `tls` to `false` to avoid bundling errors.
  2. Add `ignoreWarnings` for dynamic require warning from Supabase realtime deps.
- Env passthrough:
  - Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from process env and exposes to client.

## 4. Overall Logic & Interaction

This configuration smooths over Node core usage in the browser build and avoids noise from expected warnings, while making Supabase config available on the client.
