import { computed } from 'vue'
import useOverlayNavigation from './use-overlay-navigation'

export default function () {
  const { route } = useOverlayNavigation()

  const context = computed(() => {
    const { limit, ordering, page, search, ...filters } = route.value.query

    return { filters, limit, ordering, page: page ? parseInt(page) : 1, search }
  })

  return {
    context
  }
}
