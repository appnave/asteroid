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
      /**
       * Identificador único da query no cache do TanStack.
       * Quando a key muda reativamente (ex: troca de página ou filtro), um novo fetch é disparado automaticamente.
       * O `!!this.beforeFetch` diferencia instâncias com e sem beforeFetch, evitando que o TanStack
       * deduplique queries de componentes com comportamentos distintos.
       */
      queryKey: computed(() => [this.entity, this.url, this.$route.query, !!this.beforeFetch]),

      /**
       * Função responsável por realizar o fetch. Só é chamada quando não há cache válido ou quando
       * forçado por `staleTime`/`refetchOnMount`.
       * Aguarda o `beforeFetch` via `mx_fetchHandlerAsync` antes de disparar o axios,
       * permitindo interceptar e modificar o payload (url, params) antes da requisição.
       */
      queryFn: async ({ signal }) => {
        const { limit, ordering, page, search, ...filters } = this.$route.query

        const basePayload = {
          url: this.resolveUrl(this.url, this.entity),
          params: this.buildFetchParams({
            filters,
            limit,
            ordering,
            page: parseInt(page) || 1,
            search,
            resultsPerPage: this.resultsPerPage
          })
        }

        const finalPayload = await this.mx_fetchHandlerAsync(basePayload)
        const { url, params } = finalPayload ?? basePayload

        return this.$axios.get(url, { params, signal })
      },

      /**
       * Exibe os dados da página anterior enquanto os novos estão sendo carregados,
       * evitando flicker de tela em branco durante a troca de filtros ou páginas.
       */
      placeholderData: keepPreviousData,

      /**
       * Tempo em ms antes de os dados serem considerados desatualizados.
       * Com `0`, os dados do cache (incluindo o persister) são imediatamente considerados stale,
       * garantindo que o `queryFn` sempre seja executado para buscar dados frescos.
       */
      staleTime: 0,

      /**
       * Garante que o `queryFn` seja sempre executado ao montar o componente,
       * mesmo que o persister já tenha restaurado dados do cache do IndexedDB.
       * Combinado com `staleTime: 0`, o persister exibe o cache instantaneamente (sem tela em branco)
       * e em seguida a API é chamada para atualizar os dados.
       */
      refetchOnMount: 'always',

      /**
       * Persiste o cache da query no IndexedDB via idb-keyval.
       * Na próxima visita, os dados são restaurados instantaneamente antes do fetch,
       * eliminando a tela em branco inicial.
       */
      persister: createQueryPersister({
        storage: {
          getItem: key => get(key),
          setItem: (key, value) => set(key, value),
          removeItem: key => del(key),
          entries: () => entries()
        }
      }).persisterFn,

      /**
       * Número de tentativas automáticas em caso de falha na requisição.
       */
      retry: 3,

      /**
       * Tempo de espera entre tentativas com backoff exponencial (1s, 2s, 4s), limitado a 30s.
       */
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
