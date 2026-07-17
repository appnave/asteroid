import asteroidConfigHandler from './helpers/asteroid-config-handler.js'

import ComponentsVite from 'unplugin-vue-components/vite'
import ComponentsWebpack from 'unplugin-vue-components/webpack'
import { pathToFileURL } from 'url'

const sourcePath = '~@appnave/quasar-app-extension-asteroid/src/'
const resolve = (...paths) => paths.map(path => sourcePath + path)

function extendQuasar (quasar, api, asteroidConfigFile) {
  // Arquivos de boot
  // https://quasar.dev/quasar-cli-vite/boot-files#introduction
  quasar.boot.push(...resolve(
    'boot/overlay-navigation.js',
    'boot/api.js',
    'boot/debug.js',
    'boot/error-pages.js',
    'boot/font-face.js',
    'boot/register.js',
    'boot/loading.js',
    'boot/query-cache.js',
    'boot/store-adapter',
    'boot/before-each.js'
  ))

  // controle das notificações
  if (asteroidConfigFile.framework.featureToggle.useNotifications) {
    quasar.boot.push(...resolve('boot/notifications'))
  }

  // Transpilação de arquivos!
  if (api.hasWebpack) {
    const transpileTarget = (
      quasar.build.webpackTranspileDependencies || // q/app-webpack >= v4
      quasar.build.transpileDependencies // q/app-webpack v3
    )

    transpileTarget.push(
      /quasar-app-extension-asteroid[\\/]src/,
      /@bildvitta[\\/]quasar-ui-asteroid[\\/]src/
    )
  }

  // Adiciona todas classes do asteroid
  quasar.css.push(...resolve('index.scss'))

  // Adiciona todos os Plugins obrigatório do Quasar
  const plugins = [
    'Dialog',
    'Loading',
    'Notify'
  ]

  plugins.forEach(plugin => quasar.framework.plugins.push(plugin))

  // Adiciona todas as classes de animação do Animate.css ao quasar
  // https://animate.style/
  const animations = [
    'slideInDown',
    'rubberBand',
    'fadeIn'
  ]

  animations.forEach(animation => quasar.animations.push(animation))

  // Configurações
  quasar.extras.push(
    'material-symbols-rounded'
  )

  quasar.framework.iconSet = 'material-symbols-rounded'
  quasar.framework.lang = 'pt-BR'
}

export default async function (api) {
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('date-fns', '^2.3.0')

  const asteroid = 'node_modules/@appnave/quasar-ui-asteroid/src/asteroid.js'
  const asteroidComponents = 'node_modules/@appnave/quasar-ui-asteroid/src/components'
  const asteroidConfig = 'node_modules/@appnave/quasar-app-extension-asteroid/src/defaults/default-asteroid-config.js'
  const vueRouter = 'node_modules/vue-router/dist/vue-router.esm-bundler.js'
  const quasar = 'node_modules/quasar'

  const { validate, getAsteroidConfigPath } = asteroidConfigHandler(api)

  // valida se existe o arquivo de configuração do asteroid "asteroid.config.js"
  validate()

  const asteroidConfigPath = getAsteroidConfigPath()
  const { default: asteroidConfigFile } = await import(pathToFileURL(asteroidConfigPath).href)

  const unpluginVueComponentsConfig = {
    dirs: [api.resolve.app(asteroidComponents)], // ajusta o path para a lib
    extensions: ['vue'],
    deep: true,
    dts: false // desativa geração de types
  }

  const alias = {
    'asteroid-config': api.resolve.app(asteroidConfig),
    'asteroid-config-app': asteroidConfigPath,
    'vue-router': api.resolve.app(vueRouter),
    asteroid: api.resolve.app(asteroid),
    quasar: api.resolve.app(quasar)
  }

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0')

    api.extendViteConf(viteConf => {
      /**
       * Corrige os paths das imagens do Leaflet para que sejam resolvidas corretamente, uma vez que o Leaflet
       * utiliza imagens que são referenciadas diretamente em seu código, e não é possível alterar isso.
       * Dessa forma, é necessário configurar os aliases para que o vite consiga resolver os paths corretamente.
       */
      const leafletImageAliases = {
        'images/layers.png': api.resolve.app('node_modules/leaflet/dist/images/layers.png'),
        'images/layers-2x.png': api.resolve.app('node_modules/leaflet/dist/images/layers-2x.png'),
        'images/marker-icon.png': api.resolve.app('node_modules/leaflet/dist/images/marker-icon.png')
      }

      viteConf.resolve.alias = Object.assign(leafletImageAliases, viteConf.resolve.alias, alias)

      // optimizeDeps (necessário para funcionamento do QasMap)
      viteConf.optimizeDeps = viteConf.optimizeDeps || {}
      viteConf.optimizeDeps.include = viteConf.optimizeDeps.include || []
      viteConf.optimizeDeps.include.push(...[
        '@fawmi/vue-google-maps',
        'fast-deep-equal',
        'humps',
        'debug',
        'pica',
        'hammerjs',
        'lodash-es',
        'date-fns',
        'date-fns/locale',
        'leaflet'
      ])

      viteConf.plugins = viteConf.plugins || []
      viteConf.plugins.push(ComponentsVite(unpluginVueComponentsConfig))
    })

    api.extendQuasarConf(quasar => extendQuasar(quasar, api, asteroidConfigFile))

    return
  }

  api.compatibleWith('@quasar/app', '^3.10.0 || ^4.0.0')

  /**
   * Corrige os paths das imagens do Leaflet para que sejam resolvidas corretamente, uma vez que o Leaflet
   * utiliza imagens que são referenciadas diretamente em seu código, e não é possível alterar isso.
   * Dessa forma, é necessário configurar os aliases para que o webpack consiga resolver os paths corretamente.
   */
  api.chainWebpack(chain => {
    chain.resolve.alias
      .set('images/layers.png', api.resolve.app('node_modules/leaflet/dist/images/layers.png'))
      .set('images/layers-2x.png', api.resolve.app('node_modules/leaflet/dist/images/layers-2x.png'))
      .set('images/marker-icon.png', api.resolve.app('node_modules/leaflet/dist/images/marker-icon.png'))
  })

  api.extendWebpack(webpack => {
    Object.assign(webpack.resolve.alias, alias)

    // Adiciona o plugin de componentes
    webpack.plugins = webpack.plugins || []
    webpack.plugins.push(ComponentsWebpack(unpluginVueComponentsConfig))
  })

  api.extendQuasarConf(quasar => extendQuasar(quasar, api, asteroidConfigFile))
}
