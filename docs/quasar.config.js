import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { configure } from 'quasar/wrappers'

import Components from 'unplugin-vue-components/vite'
import ViteYaml from '@modyfi/vite-plugin-yaml'

import { markdownPlugin } from './build/vite-plugin-markdown.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default configure(function () {
  return {
    boot: [
      'asteroid',
      'components',
      'redirect',
      'vitals'
    ],

    css: [
      'app.scss',
      'lib/doc-search.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons',
      'material-symbols-rounded'
    ],

    build: {
      vueOptionsAPI: true,

      env: {
        BUCKET: 'uploader.nave.dev',
        MAPS_API_KEY: 'AIzaSyDl00zRKG51WWBIJa8yVXqX7jFD5xyqe24',
        VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID || '',
        DEBUGGING: true
      },

      vueRouterMode: 'history',

      publicPath: '/',

      alias: {
        src: path.resolve(__dirname, 'src'),
        components: path.resolve(__dirname, 'src/components'),
        layouts: path.resolve(__dirname, 'src/layouts'),
        pages: path.resolve(__dirname, 'src/pages'),
        assets: path.resolve(__dirname, 'src/assets'),
        boot: path.resolve(__dirname, 'src/boot'),
        'asteroid-config': path.resolve(__dirname, './asteroid.config.js'),
        'asteroid-boot': path.resolve(__dirname, '../app-extension/src/boot'),
        asteroid: path.resolve(__dirname, '../ui/src/asteroid.js'),
        'asteroid-components': path.resolve(__dirname, '../ui/src/components'),
        'asteroid-plugins': path.resolve(__dirname, '../ui/src/plugins'),
        examples: path.resolve(__dirname, 'src/examples'),
        uuid: path.resolve(__dirname, './node_modules/uuid/dist/index.js'),
        vue: path.resolve(__dirname, './node_modules/vue'),
        quasar: path.resolve(__dirname, 'node_modules/quasar')
      },

      vitePlugins: [
        [Components, {
          dirs: [path.resolve(__dirname, '../ui/src/components')],
          deep: true,
          dts: false
        }],
        [ViteYaml],
        [markdownPlugin]
      ],

      viteVuePluginOptions: {
        include: [/\.vue$/, /\.md$/],

        template: {
          compilerOptions: {
            whitespace: 'preserve'
          }
        }
      },

      extendViteConf (viteConf) {
        viteConf.server = viteConf.server || {}
        viteConf.server.fs = viteConf.server.fs || {}
        viteConf.server.fs.allow = [
          ...(viteConf.server.fs.allow || []),
          path.resolve(__dirname, '..') // allow monorepo root (ui/, app-extension/)
        ]
      }
    },

    devServer: {
      port: 8080,
      open: true
    },

    framework: {
      lang: 'pt-BR',
      iconSet: 'material-icons',

      components: [
        'QPage',
        'QMarkupTable',
        'QItem'
      ],

      config: {},

      plugins: [
        'Meta',
        'Notify',
        'Loading',
        'Dialog'
      ]
    },

    animations: [
      'fadeIn'
    ],

    ssr: {
      pwa: false,
      prodPort: 3000,
      maxAge: 1000 * 60 * 60 * 24 * 30,

      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'InjectManifest'
    }
  }
})
