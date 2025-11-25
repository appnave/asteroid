<template>
  <section class="qas-filters" :class="filtersClasses">
    <div v-if="showFilters" class="row">
      <div v-if="showSearch" class="col-12" :class="searchContainerClasses">
        <slot :filter="filter" name="search">
          <q-form v-if="useSearch" @submit.prevent="filter()">
            <qas-search-input v-model="internalSearch" :placeholder="searchPlaceholder" :use-search-on-type="useSearchOnType" @clear="clearSearch" @filter="filter()" @update:model-value="onSearch">
              <template v-if="showFilterButton" #after-clear>
                <slot :context="mx_context" :filter="filter" :filters="activeFilters" name="filter-button" :remove-filter="removeFilter">
                  <pv-filters-button v-if="useFilterButton" ref="filtersButton" v-model="internalFilters" v-bind="filterButtonProps" />
                </slot>
              </template>
            </qas-search-input>
          </q-form>
        </slot>
      </div>

      <div v-else-if="showFilterButton" class="col-12">
        <slot :context="mx_context" :filter="filter" :filters="activeFilters" name="filter-button" :remove-filter="removeFilter">
          <pv-filters-button v-if="useFilterButton" ref="filtersButton" v-model="internalFilters" v-bind="filterButtonProps" />
        </slot>
      </div>
    </div>

    <div v-if="hasChip" class="q-mt-md">
      <qas-badge v-for="(filterItem, key) in activeFilters" :key="key" :data-cy="`filters-${filterItem.value}-chip`" removable @remove="removeFilter(filterItem)">
        <div class="ellipsis qas-filters__badge-content" :title="getChipValue(filterItem.value)">
          {{ filterItem.label }}: "{{ getChipValue(filterItem.value) }}"
        </div>
      </qas-badge>
    </div>

    <slot :context="mx_context" :filter="filter" :filters="activeFilters" :remove-filter="removeFilter" />
  </section>
</template>

<script>
import QasBadge from '../badge/QasBadge.vue'
import QasSearchInput from '../search-input/QasSearchInput.vue'
import PvFiltersButton from './private/PvFiltersButton.vue'

import { useOverlayNavigation } from '../../composables'
import { useAbortController } from '../../composables/private'

import { camelize, camelizeKeys, decamelize } from 'humps'
import { humanize, parseValue } from '../../helpers/filters.js'
import contextMixin from '../../mixins/context.js'
import { getState, getAction } from '@bildvitta/store-adapter'

export default {
  name: 'QasFilters',

  components: {
    PvFiltersButton,
    QasBadge,
    QasSearchInput
  },

  mixins: [contextMixin],

  props: {
    entity: {
      required: true,
      type: String
    },

    filters: {
      default: () => ({}),
      type: Object
    },

    listenerQueryKeys: {
      type: Array,
      default: () => []
    },

    searchPlaceholder: {
      default: 'Pesquisar...',
      type: String
    },

    url: {
      default: '',
      type: String
    },

    useChip: {
      default: true,
      type: Boolean
    },

    useFilterButton: {
      default: true,
      type: Boolean
    },

    useForceRefetch: {
      type: Boolean
    },

    useFullContent: {
      type: Boolean
    },

    useSpacing: {
      default: true,
      type: Boolean
    },

    useSearch: {
      default: true,
      type: Boolean
    },

    useSearchOnType: {
      default: true,
      type: Boolean
    },

    useUpdateRoute: {
      default: true,
      type: Boolean
    },

    fieldsProps: {
      default: () => ({}),
      type: Object
    }
  },

  emits: [
    'fetch-success',
    'fetch-error',
    'update:currentFilters',
    'update:filters'
  ],

  data () {
    const { isBackgroundOverlay } = useOverlayNavigation()
    const { createAbortSignal, isCurrentRequest } = useAbortController()

    return {
      currentFilters: {},
      hasFetchError: false,
      internalFilters: {},
      internalSearch: '',
      isFetching: false,
      isBackgroundOverlay,
      /**
       * O objeto funciona como um auxiliar para armazenar opções selecionadas do lazy loading.
       * Isso é necessário porque, por padrão, não há opções no campo. As opções selecionadas servem
       * para exibir as "tags" dos filtros ativos na tela.
      */
      lazyLoadingSelectedOptions: {},
      abortController: new AbortController(),

      // Métodos do composable useAbortController
      createAbortSignal,
      isCurrentRequest
    }
  },

  computed: {
    activeFilters () {
      if (!this.hasFields) {
        return {}
      }

      const activeFilters = {}

      const fields = Object.keys(this.fields)
      const filters = camelizeKeys(this.useUpdateRoute ? this.mx_context.filters : this.currentFilters)

      for (const key in filters) {
        const hasField = fields.includes(key)

        if (hasField) {
          const field = { ...this.fields[key], ...this.formattedFieldsProps?.[decamelize(key)] }
          const value = humanize(field, this.normalizeValues(filters[key], field?.multiple))

          if (!value || (Array.isArray(value) && !value.length)) continue

          const { label, name } = field

          activeFilters[key] = { label, name, value }
        }
      }

      return activeFilters
    },

    formattedFieldsProps () {
      const formattedFieldsProps = {}

      for (const key in this.fields) {
        const decamelizedFieldKey = decamelize(key)
        const fieldsProps = this.fieldsProps[key] || {}

        /**
         * Aqui é onde se encontra a tratativa para campos lazy loading. É atribuída a prop useFetchOptionsOnFocus
         * por padrão. Ela é necessária pois toda vez que o menu do filtro é aberto é criado uma nova instância
         * e quando é fechado é destruída essa instância. O que causa que toda vez que abrir novamente o menu,
         * irá bater todos os endpoints de lazy loading.
         * Aqui também é escutado pelo evento onUpdate:selectedOptions, esse evento irá trazer as opções selecionadas
         * e elas serão salvas na chave lazyLoadingSelectedOptions para serem utilizadas posteriormente nas tags.
        */
        const hasLazyLoading = this.fields[key].useLazyLoading || fieldsProps.useLazyLoading
        const lazyLoadingProps = hasLazyLoading ? {
          useFetchOptionsOnFocus: true,
          'onUpdate:selectedOptions': options => {
            this.lazyLoadingSelectedOptions[key] = options
          }
        } : {}

        formattedFieldsProps[decamelizedFieldKey] = Object.assign(fieldsProps, lazyLoadingProps)
      }

      return formattedFieldsProps
    },

    searchContainerClasses () {
      return { 'col-md-6': !this.useFullContent }
    },

    fields () {
      return getState.call(this, { entity: this.entity, key: 'filters' })
    },

    filtersClasses () {
      return {
        'q-mb-xl': this.useSpacing
      }
    },

    filterButtonColor () {
      return this.hasActiveFilters ? 'primary' : 'grey-10'
    },

    filterButtonProps () {
      return {
        color: this.filterButtonColor,
        error: this.hasFetchError,
        fields: this.fields,
        fieldsProps: this.formattedFieldsProps,
        loading: this.isFetching,
        menuProps: {
          /**
           * O tratamento no onHide do menu é que como o menu é recriado toda vez que o filtro é aberto, ocorre que as
           * opções selecionadas anteriormente (e que não foram filtradas) não ficam salvas na memória, ocasionando em
           * campos lazy loading um problema de exibir o uuid da opção por não achar essa opção no array de options do field.
           * Para solucionar esse problema, sempre ao fechar os filtros as opções não filtradas são removidas,
           * voltando o filtro para o seu estado anterior.
          */
          onHide: this.setInternalFilters
        },

        onClear: this.clearFilters,
        onFilter: () => this.filter()
      }
    },

    hasActiveFilters () {
      return !!Object.keys(this.activeFilters).length
    },

    hasFields () {
      return !!Object.keys(this.fields || {}).length
    },

    showFilterButton () {
      return !!this.$slots.filterButton || this.useFilterButton
    },

    showFilters () {
      return this.useFilterButton || this.showSearch
    },

    showSearch () {
      return !!this.$slots.search || this.useSearch
    },

    hasChip () {
      return this.useChip && this.hasActiveFilters
    }
  },

  watch: {
    $route (to, from) {
      if (this.isBackgroundOverlay) return

      if (to.name === from.name) {
        /**
         * Verifica se alguma chave da query que está no "listenerQueryKeys" mudou,
         * se sim, faz bate o fetchFilters novamente.
        */
        const hasQueryChanged = !!this.listenerQueryKeys.find(queryKey => to.query[queryKey] !== from.query[queryKey])

        this.fetchFilters({ hasQueryChanged })
        this.useUpdateRoute && this.updateValues()
      }
    },

    internalFilters: {
      handler (value) {
        this.$emit('update:filters', value)
      },
      deep: true
    },

    filters (value) {
      this.internalFilters = value
    }
  },

  async created () {
    await this.fetchFilters()

    if (this.useUpdateRoute) {
      this.updateValues()
      this.onUpdateFilters()
    }
  },

  methods: {
    async clearFilters () {
      const { filters } = this.mx_context
      const query = { ...this.$route.query }

      const activeFilters = {
        ...filters,
        ...this.internalFilters
      }

      if (this.hasFields) {
        const fields = Object.keys(this.fields)

        for (const key in activeFilters) {
          const camelizedKey = camelize(key)
          const hasField = fields.includes(camelizedKey)

          if (hasField) {
            delete query[key]
            delete this.internalFilters[key]
          }
        }
      } else {
        this.internalFilters = {}
      }

      this.hideFiltersMenu()

      await this.updateRouteQuery(query)

      this.onUpdateFilters()
    },

    clearSearch () {
      this.internalSearch = ''
      this.filter()
    },

    async fetchFilters ({ hasQueryChanged = false } = {}) {
      const { signal, controller } = this.createAbortSignal()

      /**
       * - Verifica se houve mudança na query com base na prop "listenerQueryKeys"
       * - Verifica se a prop "useForceRefetch" foi passada para fazer o fetch mesmo já contendo dados na store.
       * - Verifica se tem fields(ou seja, já foi feito o fetch antes), ou se a prop "useFilterButton" foi passada como
       * "false", não contendo o menu lateral.
       */
      if (!hasQueryChanged && !this.useForceRefetch && (this.hasFields || !this.useFilterButton)) {
        return null
      }

      this.hasFetchError = false
      this.isFetching = true

      const { filters } = this.mx_context

      try {
        const response = await getAction.call(this, {
          entity: this.entity,
          key: 'fetchFilters',
          payload: { url: this.url, params: filters, signal }
        })

        this.$emit('fetch-success', response)
      } catch (error) {
        if (this.$axios.isCancel(error)) return

        this.hasFetchError = true
        this.$emit('fetch-error', error)
      } finally {
        // Define isFetching apenas se for a requisição mais recente
        this.isFetching = !this.isCurrentRequest(controller)
      }
    },

    async filter (external) {
      const { filters, page, ...context } = this.mx_context

      const query = {
        ...filters,
        ...this.internalFilters,
        ...external,
        ...context,
        search: this.internalSearch || undefined
      }

      for (const key in query) {
        query[key] ?? delete query[key]
      }

      this.hideFiltersMenu()

      await this.updateRouteQuery(query)

      this.onUpdateFilters()
    },

    getChipValue (value) {
      return Array.isArray(value) ? value.join(', ') : value
    },

    hideFiltersMenu () {
      this.$refs.filtersButton?.hideMenu()
    },

    setInternalFilters () {
      this.internalFilters = { ...this.currentFilters }
    },

    setSelectFieldOptions () {
      for (const key in this.lazyLoadingSelectedOptions) {
        this.fields[key].options = this.lazyLoadingSelectedOptions[key]
      }
    },

    async removeFilter ({ name }) {
      const query = { ...this.$route.query }

      delete query[name]
      delete this.internalFilters[name]

      await this.updateRouteQuery(query)

      this.onUpdateFilters()
    },

    onUpdateFilters () {
      this.setCurrentFilters()
      this.setSelectFieldOptions()
    },

    setCurrentFilters () {
      this.currentFilters = {
        ...this.internalFilters,
        ...(this.internalSearch && { search: this.internalSearch })
      }

      this.$emit('update:currentFilters', this.currentFilters)
    },

    async updateRouteQuery (query) {
      this.useUpdateRoute && await this.$router.push({ query })
    },

    updateValues () {
      this.setSearch()
      this.setFilters()
    },

    normalizeValues (value, isMultiple) {
      if (Array.isArray(value)) return value

      return isMultiple ? [value] : value
    },

    onSearch () {
      if (this.useSearchOnType) {
        this.filter()
      }
    },

    setSearch () {
      const { search } = this.mx_context

      this.internalSearch = search || ''
    },

    setFilters () {
      this.internalFilters = {}

      const { filters } = this.mx_context

      for (const key in filters) {
        this.internalFilters[key] = parseValue(this.normalizeValues(filters[key], this.fields[key]?.multiple))
      }
    }
  }
}
</script>

<style lang="scss">
.qas-filters {
  &__badge-content {
    max-width: 300px;
  }
}
</style>
