<template>
  <div class="qas-transfer row" :class="gutterClass">
    <div class="col-12" />
    <div class="col-12 col-sm">
      <qas-label :label="label" :quantity="optionsList.length" />

      <qas-search-box v-model:results="firstResults" :list="optionsList" outlined v-bind="searchBoxProps">
        <template #default>
          <q-list separator>
            <q-item v-for="(item, index) in firstResults" :key="index" :class="getItemClass(item, true)" clickable @click="onSelectQueue(item, true)">
              <slot name="item-first-column">
                <q-item-section>{{ getItemLabel(item) }}</q-item-section>
              </slot>
            </q-item>
          </q-list>
        </template>
      </qas-search-box>
    </div>

    <div class="col-12 col-sm-auto items-center justify-center q-col-gutter-md row" :class="actionsClass">
      <div>
        <qas-btn :class="iconClass" color="primary" :disabled="!firstQueue.length" icon="sym_r_arrow_circle_down" variant="tertiary" @click="setSelectedFromClick(true)" />

        <qas-tooltip text="Selecionar" />
      </div>
      <div>
        <div>
          <qas-btn :class="iconClass" color="primary" :disabled="!secondQueue.length" icon="sym_r_arrow_circle_up" variant="tertiary" @click="setSelectedFromClick()" />

          <qas-tooltip text="Remover" />
        </div>
      </div>
    </div>

    <div class="col-12 col-sm">
      <qas-label label="Selecionadas" :quantity="selectedList.length" />

      <qas-search-box v-model:results="secondResults" v-bind="searchBoxProps" empty-list-height="300px" label="Selecionadas" :list="selectedList" outlined>
        <template #default>
          <q-list separator>
            <q-item v-for="(item, index) in secondResults" :key="index" :class="getItemClass(item)" clickable @click="onSelectQueue(item)">
              <slot name="item-second-column">
                <q-item-section>{{ getItemLabel(item) }}</q-item-section>
              </slot>
            </q-item>
          </q-list>
        </template>
      </qas-search-box>
    </div>
  </div>
</template>

<script>
import { extend } from 'quasar'

import QasBtn from '../btn/QasBtn.vue'
import QasLabel from '../label/QasLabel.vue'
import QasSearchBox from '../search-box/QasSearchBox.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

export default {
  name: 'QasTransfer',

  components: {
    QasBtn,
    QasLabel,
    QasSearchBox,
    QasTooltip
  },

  props: {
    emitValue: {
      type: Boolean
    },

    fuseOptions: {
      default: () => ({ keys: ['label'] }),
      type: Object
    },

    label: {
      default: '',
      required: true,
      type: String
    },

    labelKey: {
      default: 'label',
      type: String
    },

    modelValue: {
      default: () => [],
      type: Array
    },

    options: {
      default: () => [],
      type: Array
    },

    useEmptySlot: {
      default: true,
      type: Boolean
    },

    valueKey: {
      default: 'value',
      type: String
    }
  },

  emits: ['update:modelValue'],

  data () {
    return {
      firstQueue: [],
      optionsList: [],
      secondQueue: [],
      selectedList: [],
      firstResults: [],
      secondResults: []
    }
  },

  computed: {
    actionsClass () {
      return !this.$qas.screen.isSmall && 'column'
    },

    gutterClass () {
      return `q-col-gutter-${this.$qas.screen.untilLarge ? 'md' : 'xl'}`
    },

    iconClass () {
      return !this.$qas.screen.isSmall && 'qas-transfer__icon'
    },

    searchBoxProps () {
      return {
        fuseOptions: this.fuseOptions,
        useEmptySlot: this.useEmptySlot
      }
    }
  },

  watch: {
    options: {
      handler (value) {
        this.optionsList = extend(true, [], value)
        this.setSelectedFromValue(true)
      },

      immediate: true
    },

    modelValue: {
      handler () {
        this.setSelectedFromValue(true)
      },

      immediate: true
    }
  },

  methods: {
    deleteItemsFromList (isFirst) {
      this[isFirst ? 'firstQueue' : 'secondQueue'].forEach(item => {
        const model = isFirst ? 'optionsList' : 'selectedList'
        const index = this[model].findIndex(itemValue => {
          return (itemValue[this.valueKey] || itemValue) === item[this.valueKey]
        })

        if (~index) {
          this[model].splice(index, 1)
        }
      })
    },

    getItemClass (object, isFirst) {
      return this[isFirst
        ? 'firstQueue'
        : 'secondQueue'
      ].some(item => item[this.valueKey] === object[this.valueKey]) && 'bg-grey-4'
    },

    getItemLabel (item) {
      return item?.[this.labelKey]
    },

    getModelValue () {
      const selectedList = extend(true, [], this.selectedList)
      return this.emitValue ? selectedList.map(item => item[this.valueKey]) : selectedList
    },

    handleSelectedList (isFirst) {
      const model = isFirst ? 'firstQueue' : 'secondQueue'

      this[isFirst ? 'selectedList' : 'optionsList'].push(...this[model])
      this.deleteItemsFromList(isFirst)
      this[model] = []
    },

    onSelectQueue (item, isFirst) {
      const model = isFirst ? 'firstQueue' : 'secondQueue'
      const index = this[model].findIndex(selected => selected[this.valueKey] === item[this.valueKey])

      ~index ? this[model].splice(index, 1) : this[model].push(item)
    },

    setSelectedFromClick (isFirst) {
      this.handleSelectedList(isFirst)
      this.updateModelValue()
    },

    setSelectedFromValue (isFirst) {
      this.optionsList.length && this.modelValue.forEach(item => {
        const selected = this.optionsList.find(option => {
          return option[this.valueKey] === (this.emitValue ? item : item[this.valueKey])
        })

        if (selected) {
          this.firstQueue.push(extend(true, {}, selected))
        }
      })

      this.handleSelectedList(isFirst)
    },

    updateModelValue () {
      return this.$emit('update:modelValue', this.getModelValue())
    }
  }
}
</script>

<style lang="scss">
.qas-transfer {
  &__icon {
    transform: rotate(-90deg);
  }
}
</style>
