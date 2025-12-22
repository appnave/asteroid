import { install } from '@bildvitta/quasar-ui-asteroid/src/asteroid'
import fontFace from 'asteroid-boot/font-face.js'
import debug from 'asteroid-boot/debug.js'
import overlayNavigation from 'asteroid-boot/overlay-navigation.js'
import beforeEach from 'asteroid-boot/before-each.js'

import axios from 'axios'
import { boot } from 'quasar/wrappers'

import { InitializeGlobalStores } from '@bildvitta/store-adapter'

export default boot(config => {
  config.app.use(InitializeGlobalStores)
  config.app.use(install)

  // adicionado para componentes que usam `inject` terem acesso ao axios e não quebrar na doc.
  config.app.provide('axios', axios)
  beforeEach(config)
  debug()
  fontFace()
  overlayNavigation(config)
})
