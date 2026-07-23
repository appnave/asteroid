import asteroidConfigHandler from './helpers/asteroid-config-handler.js'

import ComponentsVite from 'unplugin-vue-components/vite'
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
  api.compatibleWith('date-fns', '^4.1.0')

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
    dirs: [api.resolve.app(asteroidComponents)],
    extensions: ['vue'],
    deep: true,
    dts: false,
    include: [/\.vue$/, /\.vue\?vue/]
  }

  const alias = {
    'asteroid-config': api.resolve.app(asteroidConfig),
    'asteroid-config-app': asteroidConfigPath,
    'vue-router': api.resolve.app(vueRouter),
    asteroid: api.resolve.app(asteroid),
    quasar: api.resolve.app(quasar),
    'images/layers.png': api.resolve.app('node_modules/leaflet/dist/images/layers.png'),
    'images/layers-2x.png': api.resolve.app('node_modules/leaflet/dist/images/layers-2x.png'),
    'images/marker-icon.png': api.resolve.app('node_modules/leaflet/dist/images/marker-icon.png')
  }

  api.compatibleWith('@quasar/app-vite', '^2.0.0')

  api.extendViteConf(viteConf => {
    Object.assign(viteConf.resolve.alias, alias)

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
}
