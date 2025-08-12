# File: supabase/schema.sql

## 1. File-Level Overview

- Module Purpose: Comprehensive SQL schema for XNote including folders, documents, document snapshots, indexes, RLS policies, and triggers.
- Role in Project: Authoritative database definition for provisioning in Supabase.
- Key Dependencies: PostgreSQL features (UUIDs, triggers, RLS) and Supabase `auth.users`.

## 2. Global Variables and Definitions

- Tables:
  - `folders` — Hierarchical container for documents per user.
  - `documents` — Core content items with CRDT `BYTEA` `content` and timestamps.
  - `document_snapshots` — Version history for documents.
- Functions/Triggers:
  - `update_updated_at_column()` — Trigger function to maintain `updated_at` timestamps.
- Indexes: Several to optimize common lookups by foreign keys and timestamps.
- RLS Policies: Ownership-based policies for all three tables.

## 3. Detailed Breakdown

- Conditional `CREATE TABLE IF NOT EXISTS` statements to be idempotent.
- Explicit `DROP POLICY IF EXISTS` before recreating to avoid conflicts on repeated runs.
- Creation of indexes for performance.
- Trigger setup for automatic `updated_at` maintenance.

## 4. Overall Logic & Interaction

Together, tables, policies, indexes, and triggers define a secure and performant foundation for user-owned notes and their version history in Supabase.
