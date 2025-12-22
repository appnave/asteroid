export default function ({ router }) {
  const routes = [
    {
      name: 'Forbidden',
      path: '/',
      component: () => import('@bildvitta/quasar-ui-asteroid/src/pages/Forbidden.vue')
    },
    {
      name: 'ServerError',
      path: '/',
      component: () => import('@bildvitta/quasar-ui-asteroid/src/pages/ServerError.vue')
    }
  ]

  if (process.env.MODE !== 'ssr') {
    routes.push({
      name: 'NotFound',
      path: '/:catchAll(.*)*',
      component: () => import('@bildvitta/quasar-ui-asteroid/src/pages/NotFound.vue')
    })
  }

  routes.forEach(route => router.addRoute(route))
}
