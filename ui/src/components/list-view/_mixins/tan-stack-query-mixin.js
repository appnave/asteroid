import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { experimental_createQueryPersister as createQueryPersister } from '@tanstack/query-persist-client-core'
import { get, set, del, entries } from 'idb-keyval'
import { computed } from 'vue'

import debug from 'debug'
import { extend } from 'quasar'

const log = debug('asteroid-ui:qas-list-view')

export default {
  data () {
    return {
      tanStackQueryData: null,
      tanStackIsFetching: false,
      tanStackIsError: false,
      tanStackError: null,
      tanStackRefetch: null
    }
  },

  created () {
    if (!this.useQuery) return

    const { data, isFetching, isError, error, refetch } = useQuery({
      queryKey: computed(() => [this.entity, this.url, this.$route.query]),

      queryFn: async ({ signal }) => {
        const { limit, ordering, page, search, ...filters } = this.$route.query

        const params = this.buildFetchParams({
          filters,
          limit,
          ordering,
          page: parseInt(page) || 1,
          search,
          resultsPerPage: this.resultsPerPage
        })

        return this.$axios.get(this.resolveUrl(this.url, this.entity), { params, signal })
      },

      placeholderData: keepPreviousData,

      persister: createQueryPersister({
        storage: {
          getItem: key => get(key),
          setItem: (key, value) => set(key, value),
          removeItem: key => del(key),
          entries: () => entries()
        }
      }).persisterFn,

      retry: 3,

      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    })

    this.$watch(() => data.value, val => { this.tanStackQueryData = val }, { immediate: true })
    this.$watch(() => isFetching.value, val => { this.tanStackIsFetching = val }, { immediate: true })
    this.$watch(() => isError.value, val => { this.tanStackIsError = val }, { immediate: true })
    this.$watch(() => error.value, val => { this.tanStackError = val }, { immediate: true })
    this.tanStackRefetch = refetch
  },

  watch: {
    tanStackQueryData: {
      handler (response) {
        if (!response) return

        const { errors, fields, metadata, results, count } = response.data

        this.resultsQuantity = results.length
        this.count = count

        this.mx_setErrors(extend(true, {}, errors))
        this.mx_setFields(extend(true, {}, fields))
        this.mx_setMetadata(extend(true, {}, metadata))
        this.setResults(extend(true, [], results))

        this.mx_updateModels({
          errors: this.mx_errors,
          fields: this.mx_fields,
          metadata: this.mx_metadata,
          results: this.resultsList
        })

        this.isFetchListSucceeded = true

        this.$emit('fetch-success', response)

        log(`[${this.entity}]:fetchList:success (TanStack Query)`, response)
      },
      immediate: true
    },

    tanStackIsFetching (value) {
      if (this.useQuery) this.mx_isFetching = value
    },

    tanStackIsError (isError) {
      if (!this.useQuery || !isError) return

      this.mx_fetchError(this.tanStackError)
      this.$emit('update:errors', this.tanStackError)
      this.$emit('fetch-error', this.tanStackError)

      log(`[${this.entity}]:fetchList:error (TanStack Query)`, this.tanStackError)
    }
  }
}
