// ESLint configuration for cloud-resume-v2
// AGENT NOTE: This file mechanically enforces the architectural principles
// defined in docs/principles.md. If you add a new banned dependency,
// add it here AND update the principle in docs/principles.md.

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    // React component exports (from Vite template)
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // =========================================================================
    // ARCHITECTURAL BOUNDARY ENFORCEMENT
    // These rules mechanically enforce docs/principles.md.
    // Error messages include remediation instructions for agent context.
    // =========================================================================

    // Principle 1: No routing libraries
    // See docs/principles.md#principle-1-no-routing-libraries
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-router-dom',
            message:
              'BANNED (Principle 1): This is a scroll-only SPA hosted on S3/CloudFront. ' +
              'No routing library is needed or allowed. See docs/principles.md.',
          },
          {
            name: 'react-router',
            message:
              'BANNED (Principle 1): This is a scroll-only SPA hosted on S3/CloudFront. ' +
              'No routing library is needed or allowed. See docs/principles.md.',
          },
          {
            name: '@tanstack/router',
            message:
              'BANNED (Principle 1): This is a scroll-only SPA. No routing library allowed. See docs/principles.md.',
          },
          // Principle 2: No global state managers
          // See docs/principles.md#principle-2-no-global-state-managers
          {
            name: 'redux',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: '@reduxjs/toolkit',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: 'zustand',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: 'jotai',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: 'recoil',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: 'mobx',
            message:
              'BANNED (Principle 2): Use React useState/useReducer for local state. ' +
              'No global state manager allowed. See docs/principles.md.',
          },
          {
            name: '@mui/material',
            importNames: ['Box', 'Container', 'Grid', 'Grid2', 'Paper', 'Stack'],
            message:
              'BANNED (Principle 4): Layout must use Tailwind utilities, not MUI layout primitives. ' +
              'See docs/principles.md.',
          },
          {
            name: '@mui/system',
            message:
              'BANNED (Principle 4): This repo does not allow MUI system styling. ' +
              'Use Tailwind utilities instead. See docs/principles.md.',
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "JSXAttribute[name.name='sx']",
        message:
          'BANNED (Principle 4): The MUI `sx` prop is not allowed in this repo. ' +
          'Use Tailwind classes or tokens from apps/web/src/index.css instead.',
      },
    ],

    // TypeScript quality rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
