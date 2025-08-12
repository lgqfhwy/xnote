# File: src/lib/supabase/client.ts

## 1. File-Level Overview

- Module Purpose: Initialize and export a configured Supabase client for use across the app.
- Role in Project: Data access layer bootstrap; central place to create the Supabase client used by UI and server handlers.
- Key Dependencies:
  - `@supabase/supabase-js`: Official Supabase client providing auth, database, storage, and realtime APIs.
  - `process.env.NEXT_PUBLIC_SUPABASE_URL`, `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`: Environment variables used to configure the client.

## 2. Global Variables and Definitions

- `supabaseUrl: string | undefined` — Supabase project URL pulled from env; required to instantiate the client.
- `supabaseAnonKey: string | undefined` — Supabase anon/public key from env; required to instantiate the client.
- `supabase` (export): Supabase client instance created by `createClient(supabaseUrl, supabaseAnonKey)`.

## 3. Detailed Breakdown of Functions and Classes

### Export: `supabase`

- Functionality: A fully initialized Supabase client used to perform authentication and database operations.
- Parameters: None (created with env values at module initialization).
- Return Value:
  - Type: `SupabaseClient`
  - Description: Object exposing methods such as `auth`, `from`, `storage`, `functions`, etc.
- Core Implementation Logic:
  1. Read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment.
  2. If either is missing, throw an error early to fail fast during boot.
  3. Call `createClient(url, key)` from `@supabase/supabase-js` and export the instance.
- Example Usage:

  ```ts
  import { supabase } from '@/lib/supabase/client'

  const { data, error } = await supabase.from('documents').select('*')
  ```

## 4. Overall Logic & Interaction

This module centralizes Supabase initialization, ensuring consistent configuration across client code. Other modules import `supabase` to perform reads/writes and handle auth flows using the same underlying client instance.
