# File: eslint.config.mjs

## 1. File-Level Overview

- Module Purpose: ESLint flat config that extends Next.js core web vitals and TypeScript rules.
- Role in Project: Linting configuration for code quality and best practices.
- Key Dependencies: `@eslint/eslintrc` `FlatCompat` to use legacy `extends` with flat config.

## 2. Global Variables and Definitions

- `__filename`, `__dirname`: Derived via `fileURLToPath` and `dirname` for compatibility.
- `compat`: `FlatCompat` instance to bridge legacy config.
- `eslintConfig`: Array produced by `compat.extends('next/core-web-vitals', 'next/typescript')`.

## 3. Detailed Breakdown

- Computes base directory for `FlatCompat` and exports the resulting config array as default.

## 4. Overall Logic & Interaction

Allows the project to use familiar Next.js ESLint presets within the modern flat config system.
