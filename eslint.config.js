import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'assets',
    'serve_root',
    'playwright-report',
    'test-results',
    'tests',
    'worker/.wrangler-out',
    'src/data/.german-backup',
    'live_dmp.js',
    'live_index.html',
    'src/data/generateGrammar.js',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-empty': 'warn',
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'preserve-caught-error': 'off',
      'no-useless-assignment': 'off',
      'no-redeclare': 'off',
      'no-useless-escape': 'off',
    },
  },
])
