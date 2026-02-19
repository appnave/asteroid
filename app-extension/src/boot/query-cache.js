import { useQueryCache, useHistory } from 'asteroid'

const { addMany, findAll, clearAll } = useQueryCache()

let isReplacingQuery = false

function getDefaultUseCacheValue (route = {}) {
  const { name, meta } = route

  return meta.useCache ?? name?.toLowerCase?.().endsWith?.('list')
}

function getQueriesFromMatchedRoutes (matched, key) {
  const items = matched.reduce((acc, route) => {
    const queries = route.meta[key] || []

    if (queries) {
      acc.push(...queries)
    }

    return acc
  }, [])

  return new Set(items)
}

function getQueriesToExclude (route) {
  const routes = route.matched || []
  const excludes = getQueriesFromMatchedRoutes(routes, 'excludes').add('page')
  const includes = getQueriesFromMatchedRoutes(routes, 'includes')

  includes.forEach(value => excludes.delete(value))

  return excludes
}

function setRouteCache (route) {
  if (!getDefaultUseCacheValue(route)) return

  let filteredQuery = {}

  const { query } = route || {}
  const queriesToExclude = getQueriesToExclude(route)

  if (queriesToExclude.size) {
    for (const item in query) {
      if (!queriesToExclude.has(item)) {
        filteredQuery[item] = query[item]
      }
    }
  } else {
    filteredQuery = query
  }

  const hasQueryParams = !!Object.keys(filteredQuery).length

  if (!hasQueryParams) {
    clearAll(route.name)
    return
  }

  addMany(route.name, filteredQuery)
}

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    if (!useHistory().hasPreviousRoute.value) {
      clearAll(to.name)

      return next()
    }

    setRouteCache(from)

    const { query } = to
    const useCache = getDefaultUseCacheValue(to)
    const hasQueries = !!Object.keys(query).length
    const isSameRoute = to.name === from.name
    const useCachedQuery = !isSameRoute && !hasQueries && useCache

    if (useCachedQuery && !isReplacingQuery) {
      const cachedQuery = findAll(to.name) || {}

      isReplacingQuery = true

      next({ ...to, query: cachedQuery })
    } else {
      isReplacingQuery = false

      next()
    }
  })
}
