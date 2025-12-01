<template>
  <component :is="parentComponent.is" :key="counterKey" class="qas-table-generator" :class="tableClasses">
    <slot name="parent-header">
      <qas-header v-if="hasHeaderProps" v-bind="headerProps" />
    </slot>

    <q-table v-show="hasResults" ref="table" v-bind="attributes" v-model:selected="selectedModel" class="bg-white text-grey-8">
      <template v-if="loading" #header-cell="props">
        <q-th v-if="props.col.name !== 'actions'" :props="props">
          <q-skeleton v-bind="getThSkeletonProps()" animation="blink" class="bg-blue-grey-4" type="text" />
        </q-th>
      </template>

      <!-- Necessário para sobrescrever o QCheckbox e usar o QasCheckbox. -->
      <template #header-selection="props">
        <q-skeleton v-if="loading" animation="blink" class="bg-blue-grey-4" size="18px" />

        <div v-else class="qas-table-generator__cancel-mouse-target" data-table-ignore-tr-hover>
          <qas-checkbox v-model="props.selected" />
        </div>
      </template>

      <!-- Necessário para sobrescrever o QCheckbox e usar o QasCheckbox. -->
      <template #body-selection="props">
        <q-skeleton v-if="loading" animation="blink" class="bg-blue-grey-4" size="18px" />

        <div v-else class="qas-table-generator__cancel-mouse-target" data-table-ignore-tr-hover>
          <qas-checkbox v-model="props.selected" />
        </div>
      </template>

      <template v-for="(_, name) in slots" #[name]="context">
        <slot :name="name" v-bind="context" />
      </template>

      <template v-for="(fieldName, index) in bodyCellNameSlots" :key="index" #[`body-cell-${fieldName}`]="context">
        <q-td :class="getTdClasses(context.row)">
          <q-skeleton v-if="loading" v-bind="getTgSkeletonProps(fieldName, context.row)" animation="blink" />

          <component :is="tdChildComponent" v-else class="qas-table-generator__td-item" v-bind="getTdChildComponentProps(context.row)">
            <slot :name="`body-cell-${fieldName}`" v-bind="context || {}">
              <pv-table-generator-td v-if="getFieldsProps(context.row, context.rowIndex)[fieldName]" :component-data="getFieldsProps(context.row, context.rowIndex)[fieldName]" :label="normalizedFields[fieldName]?.label" :name="fieldName" :row="context.row" />

              <template v-else>
                {{ context.row?.[fieldName] }}
              </template>
            </slot>
          </component>
        </q-td>
      </template>
    </q-table>

    <qas-empty-result-text v-if="!hasResults" />
  </component>
</template>

<script>
import PvTableGeneratorTd from './private/PvTableGeneratorTd.vue'
import QasBox from '../box/QasBox.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasHeader from '../header/QasHeader.vue'
import QasCheckbox from '../checkbox/QasCheckbox.vue'

import { isEmpty, humanize, setScrollOnGrab, setScrollGradient } from '../../helpers'

import { extend } from 'quasar'

export default {
  name: 'QasTableGenerator',

  components: {
    PvTableGeneratorTd,
    QasBox,
    QasEmptyResultText,
    QasHeader,
    QasCheckbox
  },

  provide () {
    return {
      /**
       * @see QasBtn.vue - Injetando os valores padrões para o QasBtn.
       */
      btnPropsDefaults: {
        size: 'md'
      }
    }
  },

  props: {
    actionsMenuProps: {
      default: undefined,
      type: Function
    },

    columns: {
      default: () => [],
      type: Array
    },

    rowRouteFn: {
      type: Function,
      default: undefined
    },

    fields: {
      default: () => ({}),
      type: [Array, Object]
    },

    fieldsProps: {
      default: () => ({}),
      type: [Object, Function]
    },

    headerProps: {
      default: () => ({}),
      type: Object
    },

    maxHeight: {
      type: String,
      default: '528px'
    },

    results: {
      default: () => [],
      required: true,
      type: Array
    },

    rowKey: {
      default: 'name',
      type: String
    },

    emptyResultText: {
      default: '-',
      type: String
    },

    selected: {
      default: () => [],
      type: Array
    },

    loading: {
      type: Boolean
    },

    useBox: {
      type: Boolean,
      default: true
    },

    useSelection: {
      type: Boolean
    },

    useScrollOnGrab: {
      type: Boolean,
      default: true
    },

    useObjectSelectedModel: {
      type: Boolean
    },

    useExternalLink: {
      type: Boolean
    },

    useStickyHeader: {
      type: Boolean
    },

    useVirtualScroll: {
      type: Boolean
    }
  },

  emits: ['update:selected'],

  data () {
    return {
      scrollableElement: null,
      scrollOnGrab: {},
      elementToObserve: null,
      resizeObserver: null,
      scrollGradientX: setScrollGradient({ orientation: 'x' }),
      counterKey: 0
    }
  },

  computed: {
    normalizedFields () {
      if (this.loading) {
        const fields = {}

        this.normalizedColumns.forEach(column => {
          const columnName = column?.name || column

          fields[columnName] = {
            name: columnName,
            label: columnName.charAt(0).toUpperCase() + columnName.slice(1),
            type: 'text'
          }
        })

        return fields
      }

      return this.fields
    },

    normalizedResults () {
      if (this.loading) {
        const generatedResults = []

        for (let i = 0; i < 12; i++) {
          const result = {}

          this.normalizedColumns.forEach(column => {
            const columnName = column?.name || column

            result[columnName] = ''
          })

          result.default = result

          generatedResults.push(result)
        }

        return generatedResults
      }

      return this.results
    },

    tdChildComponent () {
      if (this.useExternalLink) return 'a'

      return this.rowRouteFn ? 'router-link' : 'span'
    },

    bodyCellNameSlots () {
      if (this.hasBodyCellSlot) return []

      return this.normalizedColumns.length
        ? this.normalizedColumns.map(column => typeof column === 'object' ? column.name : column)
        : Object.keys(this.normalizedFields)
    },

    slots () {
      const slots = {}

      for (const slotKey in this.$slots) {
        if (slotKey.includes('body-cell-')) continue

        slots[slotKey] = this.$slots[slotKey]
      }

      return slots
    },

    hasBodyCellSlot () {
      return !!this.$slots['body-cell']
    },

    hasResults () {
      return !!this.resultsByFields.length
    },

    attributes () {
      const attributes = {
        columns: this.columnsByFields,
        flat: true,
        hideBottom: true,
        pagination: { rowsPerPage: 0 },
        rowKey: this.rowKey,
        rows: this.resultsByFields,
        style: this.tableStyle,
        virtualScroll: this.useVirtualScroll,

        // fixo, sempre será múltipla
        ...(this.useSelection && { selection: 'multiple' }),

        /**
         * Necessário para aplicar o scroll vertical no container, essa funcionalidade existe quando a prop
         * "useStickyHeader" ou "useVirtualScroll" for passada.
         */
        tableClass: {
          'overflow-hidden-y': !this.useStickyHeader && !this.useVirtualScroll
        },

        // Eventos.
        onRowClick: this.$attrs.onRowClick && this.onRowClick
      }

      return attributes
    },

    columnsByFields () {
      if (!this.hasFields) {
        return this.normalizedColumns.filter(column => column instanceof Object)
      }

      const columns = []

      function columnByField (field) {
        const { label, name } = field

        columns.push({
          align: 'left',
          field: name,
          label,
          name
        })
      }

      // Automatic columns.
      if (!this.normalizedColumns.length) {
        for (const index in this.normalizedFields) {
          columnByField(this.normalizedFields[index])
        }

        return columns
      }

      // Sorting from the column list.
      this.normalizedColumns.forEach(column => {
        if (column instanceof Object) {
          // repassa as props e mergeia com as do field
          columnByField({ ...column, ...this.normalizedFields[column.name] })
        } else if (this.normalizedFields[column]) {
          columnByField(this.normalizedFields[column])
        }
      })

      return columns
    },

    hasActionsMenu () {
      return typeof this.actionsMenuProps === 'function'
    },

    /**
     * caso tenha a prop "actionsMenuProps" é adicionado automaticamente a coluna "actions" como ultimo item
     */
    normalizedColumns () {
      return this.hasActionsMenu ? [...this.columns, { name: 'actions' }] : this.columns
    },

    hasFields () {
      return Object.keys(this.normalizedFields).length
    },

    resultsByFields () {
      if (!Object.keys(this.normalizedFields).length) return []

      // Validação necessária para evitar processamento sem necessidade quando estiver em loading.
      if (this.loading) return this.normalizedResults

      const results = extend(true, [], this.normalizedResults)

      const mappedResults = results.map((result, index) => {
        for (const key in result) {
          const humanizedResult = humanize(this.normalizedFields[key], result[key])
          const formattedResult = isEmpty({ value: humanizedResult }) ? this.emptyResultText : humanizedResult

          result.default = this.normalizedResults[index]
          result[key] = formattedResult
        }

        return result
      })

      return mappedResults
    },

    rowsPerPage () {
      return this.normalizedResults.length
    },

    tableClasses () {
      return {
        'qas-table-generator--mobile': this.$qas.screen.isSmall,
        'qas-table-generator--sticky-header': this.useStickyHeader,
        'qas-table-generator--has-actions': this.hasActionsMenu
      }
    },

    tableStyle () {
      return {
        ...((this.useStickyHeader || this.useVirtualScroll) && { maxHeight: this.maxHeight })
      }
    },

    hasScrollOnGrab () {
      return !!Object.keys(this.scrollOnGrab).length
    },

    parentComponent () {
      return {
        is: this.useBox ? QasBox : 'div'
      }
    },

    hasHeaderProps () {
      return !!Object.keys(this.headerProps).length
    },

    hasAutoScrollY () {
      return this.useStickyHeader || this.useVirtualScroll
    },

    hasRowClick () {
      return typeof this.$attrs.onRowClick === 'function'
    },

    /**
     * Computada responsável por retornar o modelo selecionado normalizando os dados de acordo
     * com a prop "useObjectSelectedModel".
     *
     * @example - selectedModel
     * [{ uuid: '2f8856d0-8eca-4e41-8146-63ed2a4f23ff4c' }] // considerando que a prop "rowKey" é "uuid"
     */
    selectedModel: {
      get () {
        if (!this.useSelection) return []

        /**
         * Caso a prop "useObjectSelectedModel" for passada, que já é o padrão, o retorno é o objeto completo da linha,
         * que já o padrão do quasar, então não é necessário fazer nada.
         */
        if (this.useObjectSelectedModel) return this.selected

        /**
         * É necessário retornar o objeto completo da linha, pois o QasTableGenerator espera receber o objeto que
         * contém a chave "rowKey" para poder identificar a linha selecionada.
         *
         * @example - selected ['2f8856d0-8eca-4e41-8146-63ed2a4f23ff4c']
         */
        return this.selected.map(row => ({ [this.rowKey]: row }))
      },

      /**
       * Se a prop "useObjectSelectedModel" for passada, o evento "update:selected" é emitido array com o objeto completo
       * da linha, caso contrário, é emitido apenas o array com valor da chave da linha (rowKey).
       */
      set (rows) {
        this.$emit('update:selected', this.useObjectSelectedModel ? rows : rows.map(row => row[this.rowKey]))
      }
    }
  },

  mounted () {
    if (!this.hasAutoScrollY) {
      const scrollElement = this.getScrollElement()

      this.scrollGradientX.initializeScrollGradient(scrollElement)
    }

    if (!this.useScrollOnGrab) return

    this.setObserver()
    window.addEventListener('resize', this.handleScrollOnGrab)
  },

  onUnmounted () {
    if (!this.hasAutoScrollY) {
      const scrollElement = this.getScrollElement()

      this.scrollGradientX.removeScrollGradient(scrollElement)
    }

    if (!this.hasScrollOnGrab) return

    this.destroyObserver()
    this.scrollOnGrab.destroyEvents()
    window.removeEventListener('resize', this.handleScrollOnGrab)
  },

  methods: {
    initializeScrollOnGrab () {
      if (this.hasScrollOnGrab) return

      const element = this.getScrollElement()

      this.scrollOnGrab = setScrollOnGrab(element, {}, 'qas-table-generator__cancel-mouse-target')
    },

    getTableElementComponent () {
      return this.$refs?.table?.$el
    },

    getScrollElement () {
      return this.getTableElementComponent().querySelector('.q-table__middle.scroll')
    },

    getTableElement () {
      return this.getTableElementComponent()?.querySelector('table')
    },

    getFullTableWidth () {
      const tableElement = this.getTableElement()
      return tableElement?.getBoundingClientRect?.()?.width
    },

    getContainerTableWidth () {
      const containerElement = this.getTableElementComponent()?.querySelector('.q-table__middle')
      return containerElement?.getBoundingClientRect?.()?.width
    },

    handleScrollOnGrab () {
      const fullTableWidth = this.getFullTableWidth()
      const containerTableWidth = this.getContainerTableWidth()
      const hasScrollOnGrab = !!Object.keys(this.scrollOnGrab).length

      if (fullTableWidth > containerTableWidth) {
        this.initializeScrollOnGrab()
      } else if (hasScrollOnGrab) {
        this.scrollOnGrab.destroyEvents()
        this.scrollOnGrab.element.style.cursor = 'auto'
        this.scrollOnGrab = {}
      }
    },

    setObserver () {
      this.elementToObserve = this.getTableElement()
      this.resizeObserver = new ResizeObserver(entries => {
        entries.forEach(() => this.handleScrollOnGrab())
      })

      this.resizeObserver.observe(this.elementToObserve)
    },

    destroyObserver () {
      this.resizeObserver.unobserve(this.elementToObserve)
    },

    getTdClasses (row) {
      const routePayload = this.rowRouteFn?.(row)
      const isRoutePayloadObject = typeof routePayload === 'object'
      const hasRoutePayload = isRoutePayloadObject ? !!Object.keys(routePayload).length : !!routePayload

      return {
        'qas-table-generator__td--has-action': this.hasRowClick || hasRoutePayload
      }
    },

    getTdChildComponentProps (row) {
      if (!this.rowRouteFn || this.loading) return

      return {
        class: [
          'text-no-decoration',
          'text-grey-8',
          'flex',
          'full-width',
          'items-center',
          'full-height'
        ],

        [this.useExternalLink ? 'href' : 'to']: this.rowRouteFn(row),
        ...(this.useExternalLink && { target: '_blank' })
      }
    },

    onRowClick () {
      if (this.loading) return

      this.$attrs.onRowClick(...arguments)
    },

    getFieldsProps (row, index) {
      const isFieldsPropsFunction = typeof this.fieldsProps === 'function'

      return {
        ...(isFieldsPropsFunction ? this.fieldsProps(row, index) : this.fieldsProps),

        /**
         * caso tenha a prop "actionsMenuProps" é adicionado automaticamente a prop "actionsMenuProps"
         * dentro de "fieldsProps".
         */
        ...(this.hasActionsMenu && {
          actions: {
            component: 'QasActionsMenu',
            props: this.actionsMenuProps?.(row, index)
          }
        })
      }
    },

    getTgSkeletonProps (column, row) {
      const actionsProps = {
        width: '76px',
        height: '18px',
        class: 'bg-blue-grey-4'
      }

      if (column === 'actions') {
        return actionsProps
      }

      const normalizedFieldsProps = typeof this.fieldsProps === 'function'
        ? this.fieldsProps(row)
        : this.fieldsProps || {}

      const columnFieldProps = normalizedFieldsProps[column]

      if (columnFieldProps) {
        const { component } = columnFieldProps

        if (component === 'QasBadge') {
          return {
            width: '60px',
            height: '24px'
          }
        }

        if (component === 'QasToggleVisibility') {
          return {
            ...actionsProps,
            width: '140px'
          }
        }

        if (component === 'QasTextTruncate') {
          return {
            ...actionsProps,
            width: '200px'
          }
        }

        return actionsProps
      }

      const min = 100
      const max = 200

      const width = Math.floor(Math.random() * (max - min + 1)) + min

      return {
        type: 'text',
        width: `${width + 20}px`
      }
    },

    getThSkeletonProps () {
      const min = 60
      const max = 120

      const width = Math.floor(Math.random() * (max - min + 1)) + min

      return {
        width: `${width}px`
      }
    }
  }
}
</script>

<style lang="scss">
.qas-table-generator {
  $root: &;

  .q-table {
    thead tr {
      height: 24px;
    }

    th {
      @include set-typography($subtitle1);

      color: $grey-10;

      // altera o tamanho do ícone força o botão não quebrar.
      .qas-btn {
        .q-icon {
          font-size: 18px !important;
        }

        .q-btn__content {
          flex-wrap: nowrap;
        }
      }

      border: 0 !important;
      padding-bottom: 0;
      padding-left: 0;
      padding-top: 0;

      &:not(:last-child) {
        padding-right: var(--qas-spacing-md);
      }

      &:last-child {
        padding-right: 0;
      }
    }

    td,
    th,
    thead,
    tr {
      border-color: $grey-4;
    }

    td {
      @include set-typography($body1);

      height: 40px;
      padding-bottom: var(--qas-spacing-sm);
      padding-left: 0;
      padding-top: var(--qas-spacing-sm);
      position: relative;
      z-index: 0;

      &:not(:last-child) {
        padding-right: var(--qas-spacing-md);
      }

      &:last-child {
        padding-right: 0;
      }

      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        z-index: -1;
        background-color: transparent;
      }

      &:first-child::before {
        left: calc(var(--qas-spacing-md) * -1);
      }

      &:last-child::before {
        right: calc(var(--qas-spacing-md) * -1);
      }
    }

    tr:hover td::before {
      background-color: var(--qas-background-color);
    }

    &__middle {
      padding-left: var(--qas-spacing-md);
      padding-right: var(--qas-spacing-md);
    }

    // Necessário para não ter cor de fundo quando uma linha estiver sido selecionada pela prop "selected".
    tbody td:after {
      background-color: transparent;
    }

    tbody tr {
      /*
        A regra só é aplicada se nenhum elemento filho com o atributo "data-table-ignore-tr-hover"
        estiver também em estado de hover, impedindo que estilos conflitantes sejam aplicados.
        Especificamente, dentro da célula:
        - Elementos que não possuem filhos com "data-table-ignore-tr-hover" ou "data-table-ignore-hover"
          receberão a cor definida pela variável CSS "--q-primary-contrast".
        - Elementos dentro de células marcadas como tendo ações ("qas-table-generator__td--has-action")
          e também com o atributo "data-table-hover" serão estilizados da mesma maneira.
      */
      &:hover:not(:has(td *[data-table-ignore-tr-hover]:hover)) {
        td:not(:has(*[data-table-ignore-tr-hover])):not(:has(*[data-table-ignore-hover])).qas-table-generator__td--has-action *,
        td.qas-table-generator__td--has-action *[data-table-hover] {
          color: var(--q-primary-contrast) !important;
        }
      }
    }

    thead tr:hover {
      background-color: white !important;
    }
  }

  .q-table__container {
    margin-left: calc(var(--qas-spacing-md) * -1);
    margin-right: calc(var(--qas-spacing-md) * -1);
  }

  &--has-actions {
    td:last-child #{$root}__td-item {
      display: flex;
      justify-content: flex-end;
    }
  }

  &--mobile {
    margin: 0 -10px;

    .q-table {
      margin-left: 10px;
    }
  }

  &--sticky-header {
    .q-table thead tr {
      th {
        position: sticky;
        z-index: 1;
      }

      &:first-child {
        th {
          background-color: white;
          top: 0;
        }
      }
    }
  }
}
</style>
