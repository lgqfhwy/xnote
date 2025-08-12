# File: src/lib/supabase/schema.sql

## 1. File-Level Overview

- Module Purpose: Minimal SQL schema defining `folders` and `documents` tables and basic RLS policies for a prototype.
- Role in Project: Database schema reference for early-stage app features.
- Key Dependencies: Supabase/PostgreSQL features like UUIDs, RLS policies, and timestamps.

## 2. Global Variables and Definitions

- Tables:
  - `folders`: hierarchical folders per user.
  - `documents`: user documents, optional `folder_id`, CRDT binary `content`.
- RLS Policies:
  - `Users can manage their own folders/documents` — Ensures per-user access.

## 3. Detailed Breakdown of Objects

- `CREATE TABLE folders` — PK `id`, FK `user_id` to `auth.users`, optional `parent_folder_id` to self, `name`, timestamps.
- `CREATE TABLE documents` — PK `id`, FK `user_id`, optional `folder_id`, `title`, `content` as `BYTEA`, timestamps.
- Enable RLS for both tables.
- Policies grant full CRUD to rows owned by `auth.uid()`.

## 4. Overall Logic & Interaction

This lightweight schema supports basic note organization and content storage with per-user isolation. A more complete schema is maintained in `supabase/schema.sql`.
