import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue({
    script: {
      defineModel: true,
      propsDestructure: true
    },
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('q-')
      }
    }
  })],

  resolve: {
    alias: {
      asteroid: path.resolve(__dirname, 'ui/src/asteroid.js'),
      'asteroid-config': path.resolve(__dirname, 'docs/asteroid.config.js'),
      'vue-router': path.resolve(__dirname, 'docs/node_modules/vue-loader'),
      quasar: 'quasar/dist/quasar.client.js'
    },
    dedupe: ['vue', '@vue/runtime-core']
  },

  test: {
    globals: true,
    environment: 'jsdom',
    includeSource: [
      'ui/src/helpers/**/*.{js,ts}',
      'ui/src/components/**/*.{js,ts}'
    ],
    server: {
      deps: {
        inline: ['vue', 'quasar', '@vue/test-utils', '@bildvitta/quasar-ui-asteroid']
      }
    }
  }
})
