import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHashHistory, createWebHistory } from 'vue-router'

import routes from './routes'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : (import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_MODE === 'ssr' ? void 0 : import.meta.env.QUASAR_VUE_ROUTER_BASE),

    routes,

    scrollBehavior: (to, _, savedPosition) => (
      to.hash.length > 1 ? false : (savedPosition || { left: 0, top: 0 })
    )
  })

  return Router
})
