/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const path = require('path')

const { configure } = require('quasar/wrappers')

/* eslint-env node */
const ESLintPlugin = require('eslint-webpack-plugin')

const { getVueComponent } = require('./build/markdown.js')

module.exports = configure(function (quasar) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'asteroid',
      'components',
      'redirect',
      'vitals'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss',
      'lib/doc-search.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font',
      'material-icons',
      'material-symbols-rounded'
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env: {
        BUCKET: 'uploader.nave.dev',
        MAPS_API_KEY: 'AIzaSyDl00zRKG51WWBIJa8yVXqX7jFD5xyqe24',
        VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID || '',
        DEBUGGING: true
      },

      vueRouterMode: 'history',

      vueLoaderOptions: {
        compilerOptions: {
          whitespace: 'preserve'
        }
      },

      // transpile: false,
      publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack (chain) {
        const nodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin')

        const AutoImportPlugin = require('unplugin-vue-components/webpack').default

        chain.resolve.alias.set('vue', path.resolve('./node_modules/vue'))

        chain.plugin('node-polyfill').use(nodePolyfillWebpackPlugin)
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }])

        chain.plugin('unplugin-vue-components')
          .use(AutoImportPlugin({
            dirs: ['../ui/src/components'],
            deep: true,
            dts: false
          }))

        // Alias
        chain.resolve.alias.merge({
          'asteroid-config': path.resolve(__dirname, './asteroid.config.js'),
          'asteroid-boot': path.resolve(__dirname, '../app-extension/src/boot'),
          asteroid: path.resolve(__dirname, '../ui/src/asteroid.js'),
          'asteroid-components': path.resolve(__dirname, '../ui/src/components'),
          'asteroid-plugins': path.resolve(__dirname, '../ui/src/plugins'),
          examples: path.resolve(__dirname, 'src/examples'),
          uuid: path.resolve(__dirname, './node_modules/uuid/dist/index.js'),
          'vue-router': path.resolve(__dirname, './node_modules/vue-router/dist/vue-router.esm-bundler.js'),
          quasar: path.resolve(__dirname, 'node_modules/quasar')
        })

        // YAML
        const yamlRule = chain.module.rule('yaml').test(/\.ya?ml$/).pre()

        yamlRule.use('yaml-loader').loader('yaml-loader')

        // Markdown It
        const markdownRule = chain.module.rule('md').test(/\.md$/).pre()

        markdownRule.use('vue-loader').loader('vue-loader').options({
          compilerOptions: {
            whitespace: 'preserve'
          },

          productionMode: quasar.prod,

          transformAssetUrls: {
            image: 'xlink:href',
            img: 'src',
            source: 'src',
            video: 'src'
          }
        })

        markdownRule.use('ware-loader').loader('ware-loader').options({
          raw: true,

          middleware: function (source) {
            return getVueComponent(source)
          }
        })
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      server: {
        type: 'http'
      },
      port: 8080,
      open: true // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
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

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      middlewares: [
        quasar.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'InjectManifest', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      chainWebpackCustomSW (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      manifest: {
        name: 'Asteroid Docs',
        short_name: 'Asteroid Docs',
        description: 'Asteroid Docs',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'docs'
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      }
    }
  }
})
