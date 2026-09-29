import { SessionStorage } from 'quasar'
import { filterObject } from '../helpers'

let cachedFilters = SessionStorage.getItem('cachedFilters') || {}

function updateSessionStorage () {
  SessionStorage.set('cachedFilters', cachedFilters)
}

export default function () {
  function addOne (key, { label, value }) {
    if (!cachedFilters[key]) cachedFilters[key] = {}

    cachedFilters[key][label] = value
    updateSessionStorage()
  }

  function addMany (key, filters) {
    cachedFilters[key] = filters
    updateSessionStorage()
  }

  function findOne (key, filter) {
    return cachedFilters[key]?.[filter]
  }

  function findAll (key) {
    return cachedFilters[key]
  }

  function clearOne (key, filter) {
    if (!cachedFilters[key]) return

    delete cachedFilters[key][filter]
    updateSessionStorage()
  }

  function clearAll (key, { exclude = [] } = {}) {
    if (exclude.length) {
      cachedFilters[key] = filterObject(cachedFilters[key], exclude)
    } else {
      delete cachedFilters[key]
    }

    updateSessionStorage()
  }

  function reset () {
    cachedFilters = {}

    updateSessionStorage()
  }

  return {
    addOne,
    addMany,
    findOne,
    findAll,
    clearOne,
    clearAll,
    cachedFilters,
    reset
  }
}
