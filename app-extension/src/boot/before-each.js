import useHistory from '@bildvitta/quasar-ui-asteroid/src/composables/use-history.js'
import { setDefaultFiltersBeforeEach } from '@bildvitta/quasar-ui-asteroid/src/composables/use-default-filters.js'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const { addRoute } = useHistory()

    addRoute(to)

    setDefaultFiltersBeforeEach(to, from, next)
  })
}
