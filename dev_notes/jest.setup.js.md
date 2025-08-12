# File: jest.setup.js

## 1. File-Level Overview

- Module Purpose: Extends Jest DOM assertions for testing React components.
- Role in Project: Test setup file executed before each test file.
- Key Dependencies: `@testing-library/jest-dom` for extended matchers like `toBeInTheDocument`.

## 2. Global Variables and Definitions

- None.

## 3. Detailed Breakdown

- Single import side-effect to register custom matchers.

## 4. Overall Logic & Interaction

Ensures ergonomic assertions are available across the test suite without per-file imports.
