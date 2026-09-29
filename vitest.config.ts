/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],

  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'docs/node_modules/vue')
    }
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
      'vue-router': path.resolve(__dirname, 'docs/node_modules/vue-loader'),
      quasar: path.resolve(__dirname, 'docs/node_modules/quasar/dist/quasar.client.js')
    }
  }
})
