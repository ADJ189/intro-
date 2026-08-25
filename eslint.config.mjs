import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import astro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/.astro/**',
    '**/node_modules/**',
    '**/*.min.js',
    '**/*.d.ts',
  ]),

  // Base JS rules, everywhere
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-implicit-coercion': 'error',
    },
  },

  // TypeScript (non-type-aware — keeps CI fast, no tsconfig project wiring needed)
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // React + hooks, TSX only
  {
    files: ['**/*.tsx'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '19.0' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
    },
  },

  // Astro components
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Astro frontmatter props are often unused
      'no-undef': 'off', // Astro globals (Astro.props, etc.)
    },
  },

  // Accessibility, anywhere markup is authored
  {
    files: ['**/*.astro', '**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/anchor-is-valid': 'off', // Astro/React <a> patterns trip false positives here
    },
  },

  // Prettier compatibility (disables stylistic rules that would conflict) — keep last
  prettierConfig,
)
