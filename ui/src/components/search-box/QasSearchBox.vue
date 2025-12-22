<template>
  <div class="qas-search-box">
    <qas-search-input v-bind="attributes" v-model="mx_search" />

    <slot name="after-search" />

    <div ref="scrollContainer" class="overflow-auto q-mt-md relative-position" :class="containerClasses" :style="containerStyle">
      <component :is="component.is" v-bind="component.props" class="q-mr-sm">
        <slot v-if="mx_hasFilteredOptions" />
      </component>

      <slot v-if="showSpinnerDots" name="loading">
        <div class="flex justify-center q-pb-sm">
          <q-spinner-dots color="primary" size="20px" />
        </div>
      </slot>

      <slot v-if="showEmptyResult" name="empty-result">
        <q-item class="q-px-none">
          <q-item-section class="q-px-none">
            <qas-empty-result-text />
          </q-item-section>
        </q-item>
      </slot>

      <q-inner-loading :showing="showInnerLoading">
        <q-spinner color="grey" size="2rem" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import QasBox from '../box/QasBox.vue'
import QasSearchInput from '../search-input/QasSearchInput.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'

import { QInfiniteScroll } from 'quasar'
import Fuse from 'fuse.js'
import fuseConfig from '../../shared/fuse-config'
import { searchFilterMixin } from '../../mixins'

export default {
  name: 'QasSearchBox',

  components: {
    QasBox,
    QasSearchInput,
    QasEmptyResultText,
    QInfiniteScroll
  },

  mixins: [searchFilterMixin],

  props: {
    emptyListHeight: {
      default: '100px',
      type: String
    },

    fuseOptions: {
      default: () => ({}),
      type: Object
    },

    maxHeight: {
      default: '300px',
      type: String
    },

    height: {
      default: '',
      type: String
    },

    list: {
      default: () => [],
      type: Array
    },

    modelValue: {
      default: '',
      type: String
    },

    outlined: {
      type: Boolean
    },

    placeholder: {
      default: 'Pesquisar',
      type: String
    },

    useEmptySlot: {
      default: true,
      type: Boolean
    },

    results: {
      type: Array,
      default: () => []
    }
  },

  emits: [
    'empty-result',
    'update:modelValue',
    'update:results'
  ],

  data () {
    return {
      fuse: null,
      scrollContainer: null,
      isInfiniteScrollDisabled: true
    }
  },

  computed: {
    attributes () {
      return {
        ref: 'search',
        disable: this.isDisabled,
        useDebounce: this.useLazyLoading,
        placeholder: this.placeholder,
        error: this.mx_hasFetchError,
        loading: this.mx_isFetching
      }
    },

    containerStyle () {
      return {
        // Caso tenha height, deverá ter um tamanho fixo com base no height, portanto não terá max-height.
        maxHeight: this.height ? 'auto' : this.containerHeight,
        ...(this.height && { height: this.height })
      }
    },

    hasNoOptionsOnFirstFetch () {
      return this.mx_fetchCount === 1 && !this.mx_hasFilteredOptions
    },

    containerHeight () {
      const hasEmptyList = (!this.list.length && !this.useLazyLoading) || this.hasNoOptionsOnFirstFetch

      return hasEmptyList ? this.emptyListHeight : this.maxHeight
    },

    component () {
      const infiniteScrollProps = {
        offset: 100,
        scrollTarget: this.scrollContainer,
        ref: 'infiniteScrollRef',
        disable: this.isInfiniteScrollDisabled
      }

      return {
        is: this.useLazyLoading ? 'q-infinite-scroll' : 'div',
        props: {
          ...(this.useLazyLoading && infiniteScrollProps),
          ...(this.useLazyLoading && { onLoad: this.onInfiniteScroll })
        }
      }
    },

    containerClasses () {
      return {
        'qas-search-box__container': this.outlined,
        'q-px-md': this.outlined,
        'rounded-borders': this.outlined
      }
    },

    defaultFuseOptions () {
      return {
        ...fuseConfig,
        ...this.fuseOptions
      }
    },

    isDisabled () {
      return (!this.useLazyLoading && !this.list.length) || this.hasNoOptionsOnFirstFetch
    },

    showEmptyResult () {
      return this.useEmptySlot && !this.mx_hasFilteredOptions && !this.mx_isFetching
    },

    showSpinnerDots () {
      return this.mx_hasFilteredOptions && this.mx_isFetching
    },

    showInnerLoading () {
      return !this.mx_hasFilteredOptions && this.mx_isFetching
    }
  },

  watch: {
    defaultFuseOptions (value) {
      if (this.useLazyLoading) return

      this.fuse.options = { ...this.fuse.options, ...value }
    },

    mx_hasFilteredOptions (value) {
      !value && this.$emit('empty-result')
    },

    mx_search: {
      async handler (value) {
        this.$emit('update:modelValue', value)

        if (this.useLazyLoading) {
          await this.mx_filterOptionsByStore(value)

          this.$refs.infiniteScrollRef.resume()
          this.$refs.search.input.focus()

          return
        }

        this.filterOptionsByFuse(value)
      }
    },

    modelValue: {
      handler (value) {
        this.mx_search = value
      },

      immediate: true
    },

    mx_filteredOptions: {
      handler (options) {
        this.$emit('update:results', options)
      },

      immediate: true
    }
  },

  mounted () {
    this.scrollContainer = this.$refs.scrollContainer
  },

  created () {
    this.setSearchMethod()
  },

  methods: {
    filterOptionsByFuse (value) {
      this.mx_filteredOptions = value ? this.mx_getNormalizedFuseResults(this.fuse.search(value)) : this.list
    },

    async onInfiniteScroll (_, done) {
      if (((this.mx_hasFetchError && !this.mx_hasFilteredOptions) || this.hasNoOptionsOnFirstFetch)) return done()

      if (this.mx_canFetchOptions()) {
        await this.mx_loadMoreOptions()
        return done()
      }

      done(true)
    },

    setListWatcher () {
      this.$watch('list', value => {
        this.fuse = new Fuse(value, this.defaultFuseOptions)

        this.filterOptionsByFuse(this.mx_search)
      }, { deep: true })
    },

    setSearchMethod () {
      this.useLazyLoading ? this.setLazyLoading() : this.setFuse()
    },

    setFuse () {
      const list = this.mx_getOptions(this.list)

      this.mx_filteredOptions = list
      this.fuse = new Fuse(list, this.defaultFuseOptions)

      this.setListWatcher()
    },

    async setLazyLoading () {
      this.mx_setCachedOptions('list')

      await this.mx_setFetchOptions()

      this.isInfiniteScrollDisabled = false
    }
  }
}
</script>

<style lang="scss">
.qas-search-box {
  &__container {
    min-height: 48px;
    background-color: white;
    border: 1px solid $grey-4;
  }
}
</style>
