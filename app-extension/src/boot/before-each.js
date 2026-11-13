import { useHistory, setDefaultFiltersBeforeEach } from 'asteroid'

export default ({ router }) => {
  router.beforeEach((to, from) => {
    const { addRoute } = useHistory()

    addRoute(to)

    return setDefaultFiltersBeforeEach(to, from)
  })
}
