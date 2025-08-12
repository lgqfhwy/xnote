# File: package.json

## 1. File-Level Overview

- Module Purpose: Project manifest defining scripts, dependencies, dev tooling, and metadata for XNote.
- Role in Project: Central configuration for Node ecosystem, Next.js, testing, linting, and build.
- Key Dependencies: Next.js, React 19, Supabase, ProseMirror packages, Testing Library, Jest, ESLint, Tailwind, TypeScript.

## 2. Global Variables and Definitions

- Scripts:
  - `dev`, `build`, `start`: Next.js lifecycle commands.
  - `lint`: Run Next.js/ESLint.
  - `test`, `test:watch`: Jest test runner commands.
  - `prepare`: Husky install hook.
  - `setup:db`: Helper to print setup instructions for DB schema.
- Dependency groups: `dependencies` for runtime, `devDependencies` for tooling.

## 3. Detailed Breakdown

- Pins framework versions: Next 15, React 19.
- Supabase SDK and auth UI libraries for authentication and data.
- ProseMirror packages for the editor.
- Testing stack: Jest v30, JSDOM, Testing Library.
- Linting/formatting: ESLint v9, Prettier, Tailwind v4.
- TypeScript v5 types for Node and React.

## 4. Overall Logic & Interaction

Defines the project's tooling and runtime libraries, enabling development, testing, building, and deploying the Next.js app.
