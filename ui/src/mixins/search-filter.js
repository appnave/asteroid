import { decamelize } from 'humps'
import isEqual from 'lodash-es/isEqual'
import { getAction } from '@bildvitta/store-adapter'

export default {
  props: {
    entity: {
      default: '',
      type: String
    },

    lazyLoadingProps: {
      default: () => ({}),
      type: Object
    },

    name: {
      default: '',
      type: String
    },

    fetching: {
      type: Boolean
    },

    useLazyLoading: {
      type: Boolean
    },

    optionsToExclude: {
      default: () => [],
      type: Array
    }
  },

  emits: [
    'update:modelValue',
    'update:fetching',
    'update:selectedOptions',
    'fetch-options-success',
    'fetch-options-error'
  ],

  data () {
    return {
      mx_cachedOptions: [],
      mx_fetchCount: 0,
      mx_filteredOptions: [],
      mx_foundDuplicatedOptions: [],
      mx_fromSearch: false,
      mx_hasFetchError: false,
      mx_isFetching: false,
      mx_isScrolling: false,
      mx_search: '',
      mx_hasFetched: false,
      mx_pagination: {
        page: 1,
        lastPage: null,
        hasCount: true,
        hasNextPage: false
      }
    }
  },

  computed: {
    mx_defaultLazyLoadingProps () {
      const {
        url,
        params,
        decamelizeFieldName
      } = this.lazyLoadingProps

      const defaultParams = { limit: 48 }

      return {
        url: url || '',
        params: {
          ...defaultParams,
          ...params
        },
        decamelizeFieldName: decamelizeFieldName === undefined ? true : decamelizeFieldName
      }
    },

    mx_hasFilteredOptions () {
      return !!this.mx_filteredOptions.length
    },

    mx_hasOptionsToExclude () {
      return !!this.optionsToExclude.length
    }
  },

  watch: {
    'lazyLoadingProps.params': {
      handler (newParams, oldParams) {
        if (!this.useLazyLoading || isEqual(newParams, oldParams)) return

        this.mx_cachedOptions = []

        this.mx_filterOptionsByStore('')

        setTimeout(() => this.$emit('update:modelValue', undefined))
      }
    }
  },

  created () {
    this.mx_registerSelectedOptionsEvent()
  },

  methods: {
    async mx_filterOptionsByStore (search) {
      this.mx_resetFilter(search)

      this.mx_fromSearch = !!search

      const options = await this.mx_fetchOptions()

      this.mx_resetOptions()

      this.mx_filteredOptions.push(...options)

      if (this.mx_cachedOptions.length && !search) this.mx_setInitialCachedOptions()
    },

    mx_resetOptions () {
      this.mx_filteredOptions = []
      this.mx_foundDuplicatedOptions = []
    },

    mx_resetFilter (search) {
      this.mx_search = search
      this.mx_pagination = {
        page: 1,
        lastPage: null,
        hasCount: true,
        hasNextPage: false
      }
    },

    async mx_onVirtualScroll (details) {
      const { index, ref } = details
      const lastIndex = this.mx_filteredOptions.length - 1

      if (index === lastIndex && this.mx_canFetchOptions()) {
        await this.mx_loadMoreOptions()

        this.$nextTick(() => {
          ref.reset()
          ref.refresh(lastIndex)
        })
      }

      this.$emit('virtual-scroll', details)
    },

    async mx_loadMoreOptions () {
      this.mx_isScrolling = true

      const options = await this.mx_fetchOptions()

      this.mx_filteredOptions.push(...options)

      // this is to prevent the virtual-scroll event to be fired again
      this.$nextTick(() => {
        this.mx_isScrolling = false
      })
    },

    mx_decamelizeFieldName (fieldName) {
      if (fieldName.includes('_')) return fieldName.replaceAll('_', '-')

      return decamelize(fieldName, { separator: '-' })
    },

    async mx_fetchOptions () {
      this.mx_fetchCount++

      try {
        if (!this.entity) this.mx_setMissingPropsMessage('entity')
        if (!this.name) this.mx_setMissingPropsMessage('name')

        this.mx_hasFetchError = false
        this.mx_isFetching = true

        this.$emit('update:fetching', true)

        const { url, params, decamelizeFieldName } = this.mx_defaultLazyLoadingProps

        const { data } = await getAction.call(this, {
          entity: this.entity,
          key: 'fetchFieldOptions',
          payload: {
            url,
            field: decamelizeFieldName ? this.mx_decamelizeFieldName(this.name) : this.name,
            params: {
              ...params,
              search: this.mx_search,
              offset: (this.mx_pagination.page - 1) * params.limit
            }
          }
        })

        const { results, count, hasNextPage } = data
        const hasCount = count !== undefined

        this.mx_pagination = {
          page: this.mx_pagination.page + 1,
          lastPage: hasCount ? Math.ceil(count / params.limit) : null,
          hasCount,
          hasNextPage
        }

        this.$emit('fetch-options-success', data)

        const options = this.mx_getOptions(results)

        this.mx_hasFetched = true

        return this.mx_getNonDuplicatedOptions(options)
      } catch (error) {
        this.mx_hasFetchError = true
        this.$emit('fetch-options-error', error)

        return []
      } finally {
        this.mx_isFetching = false
        this.$emit('update:fetching', false)
      }
    },

    async mx_setFetchOptions () {
      const options = await this.mx_fetchOptions()

      this.mx_filteredOptions.push(...options)
    },

    mx_setInitialCachedOptions () {
      this.mx_cachedOptions.forEach(cachedOption => {
        const hasOption = this.mx_filteredOptions.find(filteredOption => {
          return filteredOption.value === cachedOption.value
        })

        if (!hasOption && this.mx_filteredOptions.length) {
          this.mx_filteredOptions.unshift(cachedOption)
        }
      })
    },

    mx_getNonDuplicatedOptions (options = []) {
      if (this.mx_fromSearch) {
        this.mx_fromSearch = false

        return options
      }

      if (!options.length) return []

      const nonDuplicatedOptions = [...options]

      this.mx_cachedOptions.forEach(cachedOption => {
        if (this.mx_foundDuplicatedOptions.includes(cachedOption.value)) return

        const duplicatedOptionIndex = nonDuplicatedOptions.findIndex(option => {
          return option.value === cachedOption.value
        })

        if (~duplicatedOptionIndex) {
          this.mx_foundDuplicatedOptions.push(cachedOption.value)
          nonDuplicatedOptions.splice(duplicatedOptionIndex, 1)
        }
      })

      return nonDuplicatedOptions
    },

    mx_canFetchOptions () {
      const { lastPage, page, hasCount, hasNextPage } = this.mx_pagination

      const hasMorePages = hasCount ? lastPage && page <= lastPage : hasNextPage

      return hasMorePages && !this.mx_isFetching && !this.mx_isScrolling && this.useLazyLoading
    },

    mx_getMissingPropsMessage (prop) {
      return `A propriedade "${prop}" é obrigatória quando a propriedade "useLazyLoading" está ativa.`
    },

    mx_setMissingPropsMessage (prop) {
      throw new Error(this.mx_getMissingPropsMessage(prop))
    },

    mx_getNormalizedFuseResults (results = []) {
      return results.map(({ item }) => item)
    },

    mx_setCachedOptions (model) {
      this.$watch(model, options => {
        if (!options?.length) return

        options = this.mx_getOptions(options)

        /*
          * pode ser que as opções sejam inicializadas após o primeiro fetch de opções
          * fazendo com que as opções sobrescreva as que vieram através do fetch, então é
          * preciso tratar para nestes casos serem incrementadas ao invés de sobrescrever,
          * mas antes é preciso verificar se já não existe nas opções filtradas para não duplicar.
        */
        if (this.mx_fetchCount === 1) {
          options.forEach(option => {
            const index = this.mx_filteredOptions.findIndex(filteredOption => {
              return filteredOption.value === option.value
            })

            if (~index) {
              this.mx_filteredOptions.splice(index, 1)
            }
          })

          this.mx_filteredOptions.unshift(...options)
        } else {
          this.mx_filteredOptions = [...options]
        }

        this.mx_cachedOptions = [...options]
      }, { immediate: true })
    },

    mx_getOptions (options = []) {
      if (this.mx_hasOptionsToExclude) {
        this.optionsToExclude.forEach(option => {
          const index = options.findIndex(({ value }) => value === option)

          if (~index) options.splice(index, 1)
        })
      }

      return options
    },

    mx_registerSelectedOptionsEvent () {
      if (!this.useLazyLoading) return

      this.$watch('modelValue', values => {
        if (!values) return this.$emit('update:selectedOptions', [])

        const findOption = value => this.mx_filteredOptions.find(option => option.value === value)
        const isArray = Array.isArray(values)

        const selectedOptions = isArray ? values.map(findOption) : [findOption(values)]

        this.$emit('update:selectedOptions', selectedOptions)
      })
    }
  }
}
