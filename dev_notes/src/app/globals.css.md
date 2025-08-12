# File: src/app/globals.css

## 1. File-Level Overview

- Module Purpose: Global CSS including Tailwind and light/dark theme variables.
- Role in Project: App-wide styling baseline.
- Key Dependencies: Tailwind via `@import "tailwindcss"`.

## 2. Global Variables and Definitions

- CSS custom properties: `--background`, `--foreground` with dark-mode overrides.
- `@theme inline` definitions mapping CSS variables to Tailwind theme tokens.

## 3. Detailed Breakdown

- Defines theme variables with light and dark media query variants.
- Applies variables to `body` and sets base font and colors.

## 4. Overall Logic & Interaction

Provides a consistent visual theme and enables Tailwind to consume CSS variables for dynamic theming across the app.
