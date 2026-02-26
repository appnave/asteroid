import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        compilerOptions: {
          isCustomElement: tag => {
            // q-btn e q-input usam v-for + #[name] (dynamic slots),
            // que requerem tratamento de componente — não podem ser custom elements
            // q-date usa template ref ($el) e precisa ser stubbável nos testes
            const componentWithDynamicSlots = new Set([
              'q-btn',
              'q-date',
              'q-input',
              'q-infinite-scroll',
              'q-carousel',
              'q-carousel-slide',
              'q-expansion-item',
              'q-stepper',
              'q-img'
            ])
            return tag.startsWith('q-') && !componentWithDynamicSlots.has(tag)
          }
        }
      }
    })
  ],

  resolve: {
    alias: {
      asteroid: path.resolve(__dirname, 'ui/src/asteroid.js'),
      'asteroid-config': path.resolve(__dirname, 'docs/asteroid.config.js'),
      '@test-utils': path.resolve(__dirname, 'ui/src/test-utils'),
      quasar: 'quasar/dist/quasar.client.js'
    },
    dedupe: ['vue', '@vue/runtime-core']
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./ui/src/test-utils/setup.js'],
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
