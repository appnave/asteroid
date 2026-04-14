import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import neostandard from 'neostandard'
import globals from 'globals'
import asteroidPlugin from 'eslint-plugin-asteroid'
import importPlugin from 'eslint-plugin-import-x'

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      '**/*rc.js',
      '**/*.conf.js',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/dist/**',
      '**/node_modules/**',
      'ui/dev/**',
      'docs/src-bex/www/**',
      'docs/src-capacitor/**',
      'docs/src-cordova/**',
      'docs/.quasar/**',
      'docs/babel.config.js'
    ]
  },

  // ESLint recommended
  js.configs.recommended,

  // Vue 3 recommended (includes vue-eslint-parser setup)
  ...pluginVue.configs['flat/recommended'],

  // Standard rules (neostandard replaces eslint-config-standard)
  ...neostandard(),

  // Asteroid custom plugin + Import plugin
  {
    plugins: {
      asteroid: asteroidPlugin,
      import: importPlugin
    }
  },

  // Project configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly'
      }
    },

    rules: {
      // Core
      'arrow-parens': ['error', 'as-needed'],
      'one-var': ['error', 'never'],
      'multiline-ternary': 'off',
      '@stylistic/multiline-ternary': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-void': 'off',

      // Import
      'import/default': 'error',
      'import/export': 'error',
      'import/extensions': 'off',
      'import/first': 'off',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',

      // Promise
      'prefer-promise-reject-errors': 'off',

      // Vue recommended overrides
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/singleline-html-element-content-newline': 'off',

      // Vue uncategorized
      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/arrow-spacing': ['error', { before: true, after: true }],
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/block-spacing': ['error', 'always'],
      'vue/no-reserved-component-names': ['error'],
      'vue/script-indent': ['error'],
      'vue/static-class-names-order': ['error'],
      'vue/v-slot-style': ['error', 'shorthand']
    }
  }
]
