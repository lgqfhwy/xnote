# File: jest.config.js

## 1. File-Level Overview

- Module Purpose: Configures Jest for a Next.js project using `next/jest` preset, JSDOM environment, and setup file.
- Role in Project: Test runner configuration.
- Key Dependencies: `next/jest` to generate a base config aligned with Next.js.

## 2. Global Variables and Definitions

- `customJestConfig` — Object specifying `setupFilesAfterEnv` and `testEnvironment: 'jsdom'`.

## 3. Detailed Breakdown

- Calls `nextJest({ dir: './' })` to create a config builder.
- Exports `createJestConfig(customJestConfig)` so Jest picks it up.

## 4. Overall Logic & Interaction

Provides a consistent testing environment for React components and Next.js pages, loading extra matchers from the setup file.
