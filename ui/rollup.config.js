import { sync } from 'rimraf'

import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import localResolve from 'rollup-plugin-local-resolve'
import scss from 'rollup-plugin-scss'
import terser from '@rollup/plugin-terser'
import url from '@rollup/plugin-url'
import vue from 'rollup-plugin-vue'

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

// Clean build artifacts
sync('dist/!(api|vetur)')

// Setup
import pkg from './package.json' with { type: 'json' }
const { name, author, version } = pkg
const year = (new Date()).getFullYear()

const banner = `/*!
* ${name} v${version}
* (c) ${year} ${author}
* Released under the MIT License.
*/`

const replaceOptions = {
  preventAssignment: false
}

const scssOptions = {
  outputStyle: 'compressed',
  prefix: '@import \'./src/index.scss\';',
  processor: () => postcss([autoprefixer()])
}

const urlOptions = {
  include: ['**/*.svg', '**/*.png', '**/*.jp?(e)g', '**/*.gif', '**/*.webp', '**/*.mp3'],
  limit: Infinity
}

const vueOptions = {
  css: false,

  template: {
    isProduction: true
  }
}

function addEntry (format = 'esm', options = {}) {
  if (format === 'cjs') {
    if (!vueOptions.template) {
      vueOptions.template = {}
    }

    vueOptions.template.optimizeSSR = true
  }

  const entry = {
    input: `src/index.${format}.js`,

    output: [
      {
        banner,
        file: `dist/asteroid.${format}.js`,
        format
      },
      {
        banner,
        file: `dist/asteroid.${format}.min.js`,
        format,
        plugins: [terser()]
      }
    ],

    plugins: [
      localResolve(),
      json(),
      replace(replaceOptions),
      scss(scssOptions),
      vue(vueOptions),
      url(urlOptions)
    ],

    ...options
  }

  if (format === 'umd') {
    for (const index in entry.output) {
      entry.output[index].name = '{{ umdExportName }}'

      entry.output[index].globals = {
        '@fawmi/vue-google-maps': 'VueGoogleMaps',
        autonumeric: 'AutoNumeric',
        axios: 'axios',
        'date-fns': 'dateFns',
        'date-fns/locale': 'dateFnsLocale',
        'fuse.js': 'Fuse',
        humps: 'humps',
        'lodash-es': '_',
        quasar: 'Quasar',
        pica: 'Pica',
        signature_pad: 'SignaturePad',
        sortablejs: 'Sortable',
        vue: 'Vue',
        'vue-router': 'VueRouter'
      }
    }
  }

  return entry
}

export default [
  addEntry('esm'),
  addEntry('cjs'), // Server-side rendering
  addEntry('umd') // Browser
]
