# File: vercel.json

## 1. File-Level Overview

- Module Purpose: Vercel deployment configuration specifying environment variables for runtime and build.
- Role in Project: Deployment-time config to ensure Supabase env vars are available in Vercel.
- Key Dependencies: Vercel platform reads this file.

## 2. Global Variables and Definitions

- `env` — Key/value map injected at runtime.
- `build.env` — Key/value map injected during the build step.

## 3. Detailed Breakdown

- Duplicates `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in both `env` and `build.env` to cover all phases of the app lifecycle on Vercel.

## 4. Overall Logic & Interaction

Ensures the same Supabase credentials used locally are present during build and at runtime when deployed on Vercel, aligning with Next.js public env variable conventions.
