import { useHistory, setDefaultFiltersBeforeEach } from 'asteroid'

export default ({ router }) => {
  router.beforeEach((to, from) => {
    const { addRoute } = useHistory()

    addRoute(to)

    return new Promise(resolve => {
      setDefaultFiltersBeforeEach(to, from, result => resolve(result))
    })
  })
}
