<template>
  <div :id="fieldName" class="qas-nested-fields" :data-cy="`nested-fields-${fieldName}`">
    <component :is="containerComponent">
      <div v-if="useSingleLabel" class="text-left">
        <qas-label :label="fieldLabel" />
      </div>

      <div ref="inputContent">
        <component :is="componentTag" v-bind="componentProps">
          <template v-for="(row, index) in nested" :key="`row-${index}`">
            <div v-if="!row[destroyKey]" :id="`row-${index}`" class="full-width qas-nested-fields__field-item" data-cy="nested-fields-item">
              <qas-header v-if="hasHeader({ row })" class="flex" v-bind="getHeaderProps({ index, row })" />

              <slot :errors="transformedErrors" :fields="getFields(index, row)" :index="index" :model="nested[index]" name="before-fields" :update-value="updateValuesFromInput" />

              <div ref="formGenerator" :class="formGeneratorParentClasses">
                <slot :errors="transformedErrors" :fields="getFields(index, row)" :index="index" name="fields" :update-value="updateValuesFromInput">
                  <qas-form-generator v-model="nested[index]" class="col" :columns="formColumns" :common-columns="formCommonColumns" :disable="isDisabledRow(row)" :errors="transformedErrors[index]" :fields="getFields(index, row)" :fields-props="getFieldsProps(index, row)" :gutter="formGutter" @update:model-value="updateValuesFromInput($event, index)">
                    <template v-for="(slot, key) in $slots" #[key]="scope">
                      <slot v-bind="scope" :disabled="isDisabledRow(row)" :errors="transformedErrors" :index="index" :name="key" />
                    </template>
                  </qas-form-generator>
                </slot>

                <div v-if="hasInlineActions(row)" class="flex items-center qas-nested-fields__actions">
                  <qas-actions-menu v-bind="getInlineActionsMenuProps(index, row)" :use-label="false" />
                </div>
              </div>

              <slot :errors="transformedErrors" :fields="getFields(index, row)" :index="index" :model="nested[index]" name="after-fields" :update-value="updateValuesFromInput" />
            </div>
          </template>
        </component>

        <div v-if="useAdd" :class="addButtonClass">
          <slot :add="add" name="add-input">
            <div v-if="showAddFirstInputButton" class="text-left">
              <qas-btn class="q-px-sm" color="primary" data-cy="nested-fields-add-btn" :label="addFirstInputLabel" variant="tertiary" @click="add()" />
            </div>

            <div v-else-if="useInlineActions" class="cursor-pointer items-center q-col-gutter-x-md q-mt-md row" data-cy="nested-fields-add-btn" @click="add()">
              <div class="col">
                <qas-input class="disabled no-pointer-events" hide-bottom-space :label="addInputLabel" @focus="add()" />
              </div>

              <div class="col-auto">
                <qas-btn color="primary" icon="sym_r_add_circle_outline" variant="tertiary" />
              </div>
            </div>

            <div v-else class="text-left">
              <qas-btn class="q-px-sm" color="primary" data-cy="nested-fields-add-btn" icon="sym_r_add" :label="addInputLabel" variant="tertiary" @click="add()" />
            </div>
          </slot>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import QasActionsMenu from '../actions-menu/QasActionsMenu.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasBox from '../box/QasBox.vue'
import QasFormGenerator from '../form-generator/QasFormGenerator.vue'
import QasInput from '../input/QasInput.vue'
import QasLabel from '../label/QasLabel.vue'
import QasHeader from '../header/QasHeader.vue'

import { constructObject } from '../../helpers'
import { Spacing, SpacingWithNumber } from '../../enums/Spacing'

import { TransitionGroup } from 'vue'
import debug from 'debug'
import { extend } from 'quasar'

const log = debug('asteroid-ui:qas-nested-fields')

export default {
  name: 'QasNestedFields',

  components: {
    QasActionsMenu,
    QasBtn,
    QasBox,
    QasFormGenerator,
    QasInput,
    QasLabel,
    QasHeader,

    // Vue
    TransitionGroup
  },

  props: {
    actionsMenuProps: {
      type: [Object, Function],
      default: () => ({})
    },

    addFirstInputLabel: {
      type: String,
      default: 'Clique aqui para adicionar'
    },

    addInputLabel: {
      type: String,
      default: 'Adicionar'
    },

    buttonDestroyProps: {
      type: [Object, Function],
      default: () => {
        return {
          color: 'grey-10',
          icon: 'sym_r_delete',
          label: 'Excluir',
          variant: 'tertiary'
        }
      }
    },

    buttonDuplicateProps: {
      type: Object,
      default: () => {
        return {
          icon: 'sym_r_content_copy',
          label: 'Duplicar',
          useLabelOnSmallScreen: false,
          variant: 'tertiary'
        }
      }
    },

    destroyKey: {
      type: String,
      default: 'destroyed'
    },

    disabledRows: {
      type: [Array, Boolean, Function],
      default: false
    },

    errors: {
      type: [Array, Object],
      default: () => ({})
    },

    field: {
      type: Object,
      default: () => ({})
    },

    fieldsHandlerFn: {
      type: Function,
      default: undefined
    },

    fieldsProps: {
      type: [Object, Function],
      default: () => ({})
    },

    formColumns: {
      type: [Array, String, Object],
      default: () => []
    },

    formCommonColumns: {
      type: [Object, String],
      default: () => ({})
    },

    formGutter: {
      default: Spacing.Md,
      type: [String, Boolean],
      validator: value => typeof value === 'boolean' || Object.values(Spacing).includes(value)
    },

    headerProps: {
      type: Function,
      default: () => {}
    },

    identifierItemKey: {
      type: String,
      default: 'uuid'
    },

    rowLabel: {
      type: String,
      default: ''
    },

    rowObject: {
      type: Object,
      default: () => ({})
    },

    useAdd: {
      type: Boolean,
      default: true
    },

    useAnimation: {
      type: Boolean,
      default: true
    },

    useBox: {
      type: Boolean
    },

    useDestroyAlways: {
      type: Boolean,
      default: undefined
    },

    useDuplicate: {
      type: Boolean,
      default: true
    },

    useFirstInputButton: {
      type: Boolean,
      default: true
    },

    useHeader: {
      type: Boolean,
      default: true
    },

    useIndexLabel: {
      type: Boolean
    },

    useInlineActions: {
      type: Boolean
    },

    useSingleLabel: {
      type: Boolean
    },

    useRemoveOnDestroy: {
      type: Boolean,
      default: true
    },

    useStartsEmpty: {
      default: true,
      type: Boolean
    },

    modelValue: {
      type: Array,
      default: () => []
    }
  },

  emits: ['update:modelValue'],

  data () {
    return {
      nested: [],
      hasDestroyAlways: true
    }
  },

  computed: {
    children () {
      return this.field?.children
    },

    containerComponent () {
      return this.useBox ? QasBox : 'div'
    },

    componentTag () {
      return this.useAnimation ? 'transition-group' : 'div'
    },

    componentProps () {
      if (!this.useAnimation) return {}

      return {
        tag: 'div',
        enterActiveClass: 'animated slideInDown'
      }
    },

    fieldLabel () {
      return this.field?.label
    },

    fieldName () {
      return this.field?.name
    },

    showDestroyButton () {
      return this.nested.filter(item => !item[this.destroyKey]).length > 1 || this.hasDestroyAlways
    },

    transformedErrors () {
      return Array.isArray(this.errors) ? this.errors : constructObject(this.fieldName, this.errors)
    },

    showAddFirstInputButton () {
      return this.useFirstInputButton && !this.nested.length
    },

    addButtonClass () {
      return {
        'q-mt-md': !!this.nested.length
      }
    },

    formGeneratorParentClasses () {
      return this.useInlineActions ? 'col-12 justify-between q-col-gutter-x-md row' : 'full-width'
    },

    isButtonDestroyPropsFunction () {
      return typeof this.buttonDestroyProps === 'function'
    }
  },

  watch: {
    modelValue: {
      handler (value) {
        this.nested = extend(true, [], value)
      },
      deep: true,
      immediate: true
    },

    rowObject: {
      handler () {
        this.setDefaultNestedValue()
      },
      immediate: true
    },

    useDestroyAlways: {
      handler (value) {
        this.hasDestroyAlways = value ?? this.useStartsEmpty
      },
      immediate: true
    }
  },

  methods: {
    getInlineActionsMenuProps (index, row) {
      if (typeof this.actionsMenuProps === 'function' && this.useInlineActions) {
        return this.actionsMenuProps({
          index,
          row,
          list: this.getDefaultActionsMenuList(index, row)
        })
      }

      return {
        ...this.actionsMenuProps,
        list: this.getActionsMenuList(index, row, this.actionsMenuProps?.list)
      }
    },

    getDefaultActionsMenuList (index, row) {
      const list = {}

      const destroyProps = this.isButtonDestroyPropsFunction
        ? this.buttonDestroyProps({ index, row })
        : this.buttonDestroyProps

      if (this.useDuplicate) {
        list.duplicate = {
          ...this.buttonDuplicateProps,
          handler: () => this.add(row)
        }
      }

      if (this.showDestroyButton) {
        list.destroy = {
          ...destroyProps,
          handler: () => this.destroy(index, row)
        }
      }

      return list
    },

    getActionsMenuList (index, row, defaultList = {}) {
      const list = this.getDefaultActionsMenuList(index, row)

      for (const key in defaultList) {
        const { handler, ...content } = defaultList[key] || {}

        list[key] = {
          handler: payload => handler?.({ payload, row, index }),
          ...content
        }
      }

      return list
    },

    getFields (index, row) {
      const fields = this.children

      if (this.fieldsHandlerFn) {
        return this.fieldsHandlerFn({ fields, index, row })
      }

      return fields
    },

    getFieldsProps (index, row) {
      if (typeof this.fieldsProps === 'function') {
        return this.fieldsProps({ index, row })
      }

      return this.fieldsProps
    },

    add (row = {}) {
      const payload = { ...this.rowObject, ...row }
      const hasIdentifierKey = payload[this.identifierItemKey]

      if (hasIdentifierKey) {
        delete payload[this.identifierItemKey]
      }

      this.nested.push(payload)

      this.$nextTick(() => {
        this.useAnimation && this.setScroll()
        this.setFocus()
      })

      log('add', payload)

      this.updateModelValue()
    },

    /*
    * Se o item que for removido não tiver o identificador (uuid por ex) e "useRemoveOnDestroy" for "false"
    * ou "useRemoveOnDestroy" for "true" removemos o item do array, senão adicionamos a flag [destroyKey]
    * no item referente do array.
    *
    * Ex: ao adicionar um item e remover sem salvar, mesmo que useRemoveOnDestroy for false ele será removido
    * ao invés de adicionar a flag [destroyKey]
    */
    destroy (index, row) {
      !row[this.identifierItemKey] || this.useRemoveOnDestroy
        ? this.nested.splice(index, 1)
        : this.nested.splice(index, 1, { [this.destroyKey]: true, ...row })

      log('destroy', { index, row })

      this.updateModelValue()
    },

    updateModelValue () {
      this.$emit('update:modelValue', this.nested)
    },

    updateValuesFromInput (value, index) {
      this.nested.splice(index, 1, value)

      this.updateModelValue()
    },

    setDefaultNestedValue () {
      if (this.nested.length || this.useStartsEmpty) return
      this.nested.splice(0, 0, { ...this.rowObject })
    },

    setScroll () {
      const elements = this.$refs.inputContent.children

      // elemento de ação, e não das linhas (rows) de inputs
      const element = elements[elements.length - 1]

      // ultima linha (rows) de inputs
      const rowsElement = elements[0]?.children

      // pegamos a posição do elemento de ação
      const { top } = element.getBoundingClientRect()

      // pegamos a altura da ultima linha (rows) de inputs
      const lastRowHeight = rowsElement?.[rowsElement.length - 1]?.clientHeight

      // pegamos a posição da página
      const pageOffset = window.scrollY

      // 56 é a altura do header no mobile
      const safeScrollSize = this.$qas.screen.isSmall ? 56 + SpacingWithNumber.Lg : SpacingWithNumber.Lg

      /**
       * É necessário descontar a altura da última linha (rows) de inputs para que o scroll
       * fique no final da última linha (rows) de inputs.
       */
      const scrollTop = pageOffset + top - (lastRowHeight + safeScrollSize)

      window.scrollTo({ behavior: 'smooth', top: scrollTop })
    },

    async setFocus () {
      await this.$nextTick()

      const { formGenerator } = this.$refs
      const firstElementToBeFocused = formGenerator.pop().querySelector('input, select, textarea')

      return firstElementToBeFocused?.focus && firstElementToBeFocused.focus()
    },

    getRealRowIndex (index) {
      return [...this.nested].splice(0, index).filter(item => !item[this.destroyKey]).length
    },

    getRowLabel (rowIndex) {
      if (this.rowLabel) {
        if (!this.useIndexLabel) return this.rowLabel

        const index = this.useRemoveOnDestroy ? rowIndex : this.getRealRowIndex(rowIndex)

        return `${this.rowLabel} ${index + 1}`
      }

      return this.fieldLabel
    },

    isDisabledRow (row) {
      if (!this.disabledRows) return false

      if (typeof this.disabledRows === 'function') return this.disabledRows(row)

      if (typeof this.disabledRows === 'boolean') return true

      return this.disabledRows.includes(row[this.identifierItemKey])
    },

    hasBlockActions (row) {
      return !this.useInlineActions && !this.isDisabledRow(row)
    },

    hasInlineActions (row) {
      return this.useInlineActions && !this.isDisabledRow(row)
    },

    hasHeader ({ row }) {
      return (this.hasBlockActions(row) || !this.useSingleLabel) && this.useHeader
    },

    getHeaderProps ({ index, row }) {
      const hasLabel = !this.useSingleLabel
      const hasActions = this.hasBlockActions(row)

      const { labelProps, actionsMenuProps, ...payload } = this.headerProps?.({ index, row }) || {}

      return {
        ...payload,

        spacing: 'sm',

        ...(hasActions && {
          actionsMenuProps: {
            useLabel: false,

            ...actionsMenuProps,

            list: this.getActionsMenuList(index, row, actionsMenuProps?.list)
          }
        }),

        ...(hasLabel && {
          labelProps: {
            typography: 'h5',
            label: this.getRowLabel(index),
            ...labelProps
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.qas-nested-fields {
  // mesmo tamanho do input
  &__actions {
    height: 40px;
  }

  &__field-item + &__field-item {
    margin-top: var(--qas-spacing-lg);
  }
}
</style>
