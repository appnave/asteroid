import getPages from './pages.js'

const routes = [
  {
    path: '/',
    name: 'Root',
    component: () => import('src/layouts/DocLayout.vue'),
    meta: { useOverlay: true },
    children: getPages()
  },

  {
    path: '/paginas/not-found',
    component: () => import('../../../ui/src/pages/NotFound.vue')
  },

  {
    path: '/paginas/unauthorized',
    component: () => import('../../../ui/src/pages/Unauthorized.vue')
  },

  {
    path: '/paginas/forbidden',
    component: () => import('../../../ui/src/pages/Forbidden.vue')
  },

  {
    path: '/paginas/server-error',
    component: () => import('../../../ui/src/pages/ServerError.vue')
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../../../ui/src/pages/NotFound.vue')
  }
]

export default routes
