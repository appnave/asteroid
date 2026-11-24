import { getAction, getGetter } from '@bildvitta/store-adapter'

// Plugins
import Delete from './plugins/delete/Delete.js'
import Dialog from './plugins/dialog/Dialog.js'
import NotifyError from './plugins/notify-error/NotifyError.js'
import NotifySuccess from './plugins/notify-success/NotifySuccess.js'
import Screen from './plugins/screen/Screen.js'

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
