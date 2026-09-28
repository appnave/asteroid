import { useOverlayNavigation } from '../composables'

export default {
  data () {
    const { route } = useOverlayNavigation()

    return {
      mx_route: route
    }
  },

  computed: {
    mx_context () {
      const { limit, ordering, page, search, ...filters } = this.mx_route.query

      return { filters, limit, ordering, page: page ? parseInt(page) : 1, search }
    }
  }
}
