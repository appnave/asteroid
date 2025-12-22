<template>
  <qas-input ref="input" v-model="model" class="qas-search-input" :class="classes" v-bind="$attrs" data-cy="search-input" :debounce hide-bottom-space input-class="ellipsis text-grey-8" inputmode="search" outlined type="search">
    <template #prepend>
      <q-icon v-if="useSearchOnType" color="grey-8" name="sym_r_search" />

      <qas-btn v-else color="grey-10" icon="sym_r_search" variant="tertiary" @click="$emit('filter')" />
    </template>

    <template #append>
      <qas-btn v-if="hasSearch" color="grey-10" icon="sym_r_clear" variant="tertiary" @click="clear" />

      <slot name="after-clear" />
    </template>
  </qas-input>
</template>

<script>
import QasInput from '../input/QasInput.vue'
import QasBtn from '../btn/QasBtn.vue'

export default {
  name: 'QasSearchInput',

  components: {
    QasInput,
    QasBtn
  },

  inject: {
    isBox: { default: false },
    isDialog: { default: false }
  },

  inheritAttrs: false,

  props: {
    modelValue: {
      default: '',
      type: String
    },

    useDebounce: {
      default: true,
      type: Boolean
    },

    useSearchOnType: {
      default: true,
      type: Boolean
    }
  },

  emits: [
    'clear',
    'filter',
    'update:modelValue'
  ],

  computed: {
    classes () {
      const bordered = this.isBox || this.isDialog

      return {
        'qas-search-input--border': bordered,
        'qas-search-input--shadow': !bordered
      }
    },

    debounce () {
      return this.useDebounce ? '1200' : ''
    },

    hasSearch () {
      return !!this.model.length
    },

    input () {
      return this.$refs.input
    },

    model: {
      get () {
        return this.modelValue
      },

      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
    clear () {
      this.$emit('clear', this.modelValue)
      this.$emit('update:modelValue', '')
    }
  }
}
</script>
