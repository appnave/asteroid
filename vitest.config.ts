/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],

  resolve: {
    dedupe: ['vue', 'vue-router', 'quasar']
  },

  test: {
    globals: true,
    environment: 'jsdom',
    includeSource: [
      'ui/src/helpers/**/*.{js,ts}',
      'ui/src/components/**/*.{js,ts}'
    ],

    alias: {
      asteroid: path.resolve(__dirname, 'ui/src/asteroid.js'),
      'asteroid-config': path.resolve(__dirname, 'docs/asteroid.config.js'),
      quasar: path.resolve(__dirname, 'node_modules/quasar/dist/quasar.client.js'),
      '@bildvitta/store-adapter': path.resolve(__dirname, 'ui/node_modules/@bildvitta/store-adapter')
    }
  }
})
