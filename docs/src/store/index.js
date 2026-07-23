import { createStore } from 'vuex'

import { fields as chartFields } from './schemas/chart'
import { fields as userFields } from './schemas/user'

import chartsMock from './mocks/charts.json'
import chartsMultipleResultsMock from './mocks/charts-multiple-results.json'
import usersMock from './mocks/users.json'

const clone = value => {
  if (value === undefined) {
    return undefined
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {}
  }

  return JSON.parse(JSON.stringify(value))
}

function formatDateLabel (value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

function normalizeFilters (payload = {}) {
  return payload.filters || payload.params || {}
}

function createResponse (data = {}) {
  return {
    data: {
      status: { code: 200 },
      metadata: {},
      ...data
    }
  }
}

function createCollectionModule ({
  filters = {},
  idKey = 'uuid',
  fields = {},
  records = [],
  refineList = list => list,
  resultKey = 'result'
}) {
  return {
    namespaced: true,

    state: () => ({
      fields: clone(fields),
      filters: clone(filters),
      list: clone(records)
    }),

    getters: {
      byId: state => id => state.list.find(item => item[idKey] === id)
    },

    mutations: {
      removeById (state, id) {
        state.list = state.list.filter(item => item[idKey] !== id)
      }
    },

    actions: {
      async fetchFilters ({ state }) {
        return createResponse({ fields: clone(state.filters) })
      },

      async fetchList ({ state }, payload = {}) {
        const filters = normalizeFilters(payload)
        const results = refineList(clone(state.list), filters)

        return createResponse({
          count: results.length,
          fields: clone(state.fields),
          results
        })
      },

      async fetchSingle ({ getters, state }, payload = {}) {
        const result = clone(getters.byId(payload.id))

        return createResponse({
          fields: clone(state.fields),
          [resultKey]: result
        })
      },

      async destroy ({ commit, getters }, payload = {}) {
        const result = clone(getters.byId(payload.id))

        commit('removeById', payload.id)

        return createResponse({ result })
      }
    }
  }
}

function refineUsers (list, filters = {}) {
  const search = String(filters.search || '').trim().toLowerCase()

  return list.filter(user => {
    if (search) {
      const haystack = [user.name, user.email, user.document, user.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(search)) {
        return false
      }
    }

    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '' || key === 'search') {
        return true
      }

      return String(user[key]) === String(value)
    })
  })
}

function refineChartsMultipleResults (list, filters = {}) {
  if (!filters.date) {
    return list
  }

  const label = formatDateLabel(filters.date)

  return list.filter(item => item.label === label)
}

const chartFilterFields = {
  date: {
    name: 'date',
    label: 'Dia',
    type: 'date'
  }
}

export default async function () {
  return createStore({
    modules: {
      charts: createCollectionModule({
        fields: chartFields,
        records: chartsMock.docs
      }),

      charts_multiple_results: createCollectionModule({
        fields: chartFields,
        filters: chartFilterFields,
        idKey: 'label',
        records: chartsMultipleResultsMock.docs,
        refineList: refineChartsMultipleResults
      }),

      users: createCollectionModule({
        fields: userFields,
        filters: userFields,
        records: usersMock.docs,
        refineList: refineUsers
      })
    },

    strict: import.meta.env.DEBUGGING
  })
}
