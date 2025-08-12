# File: .husky/pre-commit

## 1. File-Level Overview

- Module Purpose: Git hook to run linters on staged files before commit.
- Role in Project: Enforces code style and formatting pre-commit via `lint-staged`.
- Key Dependencies: `husky`, `lint-staged`, `prettier`.

## 2. Global Variables and Definitions

- Command: `npx lint-staged` — Executes configured tasks against staged files.

## 3. Detailed Breakdown

- The script delegates to `lint-staged` which is configured in `package.json` to format a selection of file types.

## 4. Overall Logic & Interaction

Prevents committing unformatted code by running Prettier on staged files automatically.
