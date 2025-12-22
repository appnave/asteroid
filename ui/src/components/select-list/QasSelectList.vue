<template>
  <qas-search-box ref="searchBox" v-model:results="results" v-bind="defaultSearchBoxProps" :list="sortedList">
    <template #after-search>
      <div class="q-my-md">
        <qas-btn color="grey-10" :disable="isClearSelectionDisabled" icon="sym_r_close" label="Limpar seleção" variant="tertiary" @click="clearSelection" />
      </div>
    </template>

    <template #default>
      <q-list class="bg-white q-py-sm rounded-borders" separator>
        <q-item v-for="result in results" :key="result.value" class="q-px-none" tag="label">
          <slot v-bind="slotData" :item="result" name="item">
            <q-item-section>
              <q-item-label>
                <pv-select-list-checkbox :readonly="readonly" :result="result" :use-active="hasValueInModel(result.value)" @add="add" @remove="remove" />
              </q-item-label>
            </q-item-section>
          </slot>
        </q-item>
      </q-list>
    </template>
  </qas-search-box>
</template>

<script>
import sortBy from 'lodash-es/sortBy'

import QasBtn from '../btn/QasBtn.vue'
import QasSearchBox from '../search-box/QasSearchBox.vue'
import PvSelectListCheckbox from './private/PvSelectListCheckbox.vue'

export default {
  name: 'QasSelectList',

  components: {
    QasBtn,
    QasSearchBox,

    // private
    PvSelectListCheckbox
  },

  inheritAttrs: false,

  props: {
    addLabel: {
      type: String,
      default: 'Adicionar'
    },

    deleteLabel: {
      type: String,
      default: 'Excluir'
    },

    deleteOnly: {
      type: Boolean
    },

    emitValue: {
      type: Boolean,
      default: true
    },

    modelValue: {
      type: Array,
      default: () => []
    },

    readonly: {
      type: Boolean
    },

    searchBoxProps: {
      type: Object,
      default: () => ({})
    },

    useEmitLabelValueOnly: {
      type: Boolean,
      default: true
    }
  },

  emits: [
    'add',
    'remove',
    'clear',
    'update:modelValue'
  ],

  data () {
    return {
      searchBox: null,
      sortedList: [],
      values: [],
      results: []
    }
  },

  computed: {
    defaultSearchBoxProps () {
      return {
        fuseOptions: { keys: ['label'] },

        ...this.searchBoxProps,

        outlined: true
      }
    },

    hasLazyLoading () {
      return this.defaultSearchBoxProps.useLazyLoading
    },

    list () {
      return this.defaultSearchBoxProps.list || []
    },

    slotData () {
      return {
        add: this.add,
        remove: this.remove,
        updateModel: this.updateModel
      }
    },

    isClearSelectionDisabled () {
      return !this.modelValue.length || this.readonly || !this.results.length
    },

    hasSearch () {
      return this.searchBox.mx_search
    }
  },

  watch: {
    list: {
      handler (value) {
        if (!this.hasLazyLoading) return this.sortList()

        this.sortedList = [...value]
      },

      immediate: true
    },

    modelValue: {
      handler (value) {
        this.values = [...value]
      },

      deep: true,
      immediate: true
    }
  },

  mounted () {
    this.searchBox = this.$refs.searchBox
  },

  created () {
    if (!this.hasLazyLoading) this.handleList()
  },

  methods: {
    add (item) {
      this.values.push(this.getNormalizedValue(item))
      this.updateModel()

      this.$emit('add', item)
    },

    handleList () {
      if (this.modelValue.length) {
        return this.sortList()
      }

      const unwatch = this.$watch('modelValue', () => {
        if (!this.sortedList.length) {
          this.sortList()
          unwatch()
        }
      })
    },

    remove (item) {
      const index = this.values.findIndex(itemValue => {
        const normalizedItem = this.emitValue ? itemValue : itemValue.value

        return normalizedItem === item.value
      })

      this.values.splice(index, 1)
      this.updateModel()

      this.$emit('remove', item, index)
    },

    sortList () {
      this.sortedList = this.deleteOnly
        ? this.list.filter(item => this.hasValueInModel(item.value))
        : sortBy(this.list, item => !this.hasValueInModel(item.value))
    },

    updateModel (model) {
      this.$emit('update:modelValue', model || this.values)
    },

    hasValueInModel (value) {
      return this.emitValue
        ? this.modelValue.includes(value)
        : !!this.modelValue.find(item => item.value === value)
    },

    getNormalizedValue (objectValue = {}) {
      if (this.emitValue) return objectValue.value

      if (this.useEmitLabelValueOnly) {
        const { label, value } = objectValue

        return {
          label,
          value
        }
      }

      return objectValue
    },

    clearSelection () {
      this.$emit('clear', this.values)
      this.values = []
      this.updateModel()
    }
  }
}
</script>
