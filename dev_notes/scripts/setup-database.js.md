# File: scripts/setup-database.js

## 1. File-Level Overview

- Module Purpose: Helper script to print and guide execution of the Supabase SQL schema for initial setup.
- Role in Project: Developer tooling for database provisioning (manual step in Dashboard).
- Key Dependencies:
  - `@supabase/supabase-js`: Client constructed to verify env vars (though script only prints instructions).
  - `dotenv`: Loads `.env.local` for local development.
  - `fs`, `path`: Read schema SQL from disk.

## 2. Global Variables and Definitions

- `supabaseUrl: string`, `supabaseServiceKey: string` — Env-derived credentials; service key preferred, fallback to anon key.
- `schemaPath` — Path to `supabase/schema.sql`.

## 3. Detailed Breakdown of Functions

### Function: `setupDatabase()`

- Functionality: Reads SQL schema file and prints clear instructions to execute it in Supabase Dashboard.
- Parameters: None.
- Return Value: `Promise<void>`.
- Core Implementation Logic:
  1. Validate presence of required env vars; exit on missing values.
  2. Instantiate Supabase client (not strictly necessary for print, but validates configuration).
  3. Read `supabase/schema.sql` contents.
  4. Print separator and schema to stdout, followed by step-by-step instructions.
  5. Catch and log errors; exit with non-zero code on failure.
- Example Usage:
  - Run via Node: `node scripts/setup-database.js`

## 4. Overall Logic & Interaction

The script aids developers in bootstrapping the database schema without automating migrations. It complements the `supabase/` SQL files used for schema definition.
