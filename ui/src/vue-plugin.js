import { getAction, getGetter } from '@bildvitta/store-adapter'

// Plugins
import {
  Delete,
  Dialog,
  NotifyError,
  NotifySuccess,
  Screen
} from './plugins'

import packageInfo from '../package.json'

// Directives
import Test from './directives/Test.js'

const version = packageInfo.version

async function install (app) {
  app.config.globalProperties.$qas = {
    delete: params => Delete.call(app.config.globalProperties, params),
    dialog: Dialog,
    error: NotifyError,
    screen: Screen(),
    success: NotifySuccess
  }

  app.provide('qas', {
    delete: params => Delete.call(app.config.globalProperties, params),
    getAction: params => getAction.call(app.config.globalProperties, params),
    getGetter: params => getGetter.call(app.config.globalProperties, params)
  })

  app.directive(Test.name, Test)
}

export {
  version,
  install
}
