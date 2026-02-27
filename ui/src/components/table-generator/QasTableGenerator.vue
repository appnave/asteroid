<template>
  <component :is="parentComponent.is" class="qas-table-generator" :class="tableClasses">
    <slot name="parent-header">
      <qas-header v-if="hasHeaderProps" v-bind="headerProps" />
    </slot>

    <q-table v-show="hasResults" ref="table" v-bind="attributes" v-model:selected="selectedModel" class="bg-white text-grey-8">
      <template v-if="skeleton" #header-cell="props">
        <q-th :props="props">
          <qas-skeleton v-bind="getThSkeletonProps()" />
        </q-th>
      </template>

      <template v-for="(column, index) in columnsWithTooltip" :key="index" #[`header-cell-${column.name}`]="context">
        <q-th :props="context">
          {{ context.col.label }}

          <qas-tip class="q-pl-xs" :text="column.tooltip" />
        </q-th>
      </template>

      <!-- Necessário para sobrescrever o QCheckbox e usar o QasCheckbox. -->
      <template #header-selection="props">
        <qas-skeleton v-if="skeleton" type="QasCheckbox" />

        <div v-else class="qas-table-generator__cancel-mouse-target" data-table-ignore-tr-hover>
          <qas-checkbox v-model="props.selected" />
        </div>
      </template>

      <!-- Necessário para sobrescrever o QCheckbox e usar o QasCheckbox. -->
      <template #body-selection="props">
        <qas-skeleton v-if="skeleton" type="QasCheckbox" />

        <div v-else class="qas-table-generator__cancel-mouse-target" data-table-ignore-tr-hover>
          <qas-checkbox v-model="props.selected" />
        </div>
      </template>

      <template v-for="(_, name) in slots" #[name]="context">
        <slot :name="name" v-bind="context" />
      </template>

      <template v-for="(fieldName, index) in bodyCellNameSlots" :key="index" #[`body-cell-${fieldName}`]="context">
        <q-td :class="getTdClasses(context.row)">
          <qas-skeleton v-if="skeleton" v-bind="getTgSkeletonProps(fieldName, context.row)" />

          <component :is="tdChildComponent(context.row)" v-else class="qas-table-generator__td-item" v-bind="getTdChildComponentProps(context.row)">
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
import QasCheckbox from '../checkbox/QasCheckbox.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasHeader from '../header/QasHeader.vue'
import QasTip from '../tip/QasTip.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { isEmpty, humanize, setScrollOnGrab, setScrollGradient } from '../../helpers'

import { extend } from 'quasar'

export default {
  name: 'QasTableGenerator',

  components: {
    PvTableGeneratorTd,
    QasBox,
    QasEmptyResultText,
    QasHeader,
    QasCheckbox,
    QasTip,
    QasSkeleton
  },

  provide () {
    return {
      isTableGenerator: true,

      /**
       * @see QasBtn.vue - Injetando os valores padrões para o QasBtn.
       */
      btnPropsDefaults: {
        size: 'sm'
      },

      /**
       * @see QasTextTruncate.vue - Injetando os valores padrões para o QasTextTruncate.
       */
      textTruncatePropsDefaults: {
        typography: 'body2'
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

    skeleton: {
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

    useMultiline: {
      type: Boolean
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
      scrollGradientX: setScrollGradient({ orientation: 'x' })
    }
  },

  computed: {
    normalizedFields () {
      if (this.skeleton) {
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

      const fields = {}

      // Remover os campos do tipo "hidden".
      Object.keys(this.fields).forEach(key => {
        const field = this.fields[key]

        if (field.type === 'hidden') return

        fields[key] = field
      })

      return fields
    },

    /**
     * Caso esteja em skeleton, retorna uma lista de resultados vazios com a mesma estrutura das colunas.
     * Isso é necessário para que o QasTableGenerator renderize as linhas de skeleton corretamente.
     * Cada resultado terá chaves correspondentes aos nomes das colunas, todas com valores vazios.
     */
    normalizedResults () {
      if (this.skeleton) {
        return Array.from({ length: 24 }).map(() => {
          const result = {}

          this.normalizedColumns.forEach(column => {
            const columnName = column?.name || column

            result[columnName] = ''
          })

          result.default = result

          return result
        })
      }

      return this.results
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
      return this.hasActionsMenu ? [...this.columns, { name: 'actions', label: 'Ações' }] : this.columns
    },

    columnsWithTooltip () {
      // quando estiver em skeleton, não precisa processar as colunas com tooltip
      if (this.skeleton) return []

      return this.normalizedColumns.filter(column => column.tooltip)
    },

    hasFields () {
      return Object.keys(this.normalizedFields).length
    },

    resultsByFields () {
      if (!Object.keys(this.normalizedFields).length) return []

      // Validação necessária para evitar processamento sem necessidade quando estiver em skeleton.
      if (this.skeleton) return this.normalizedResults

      const results = extend(true, [], this.normalizedResults)

      const mappedResults = results.map((result, index) => {
        for (const key in result) {
          if (this.fields[key]?.type === 'object') {
            continue
          }

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
        'qas-table-generator--has-actions': this.hasActionsMenu,
        'qas-table-generator--multiline': this.useMultiline
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

    /**
     * Valida se o valor retornado para a row é um route.
     *
     * @param {Object} row - Objeto referente ao row da tabela.
     *
     * @returns {boolean}
     */
    hasRowRoute (row) {
      const routePayload = this.rowRouteFn?.(row)
      const isRoutePayloadObject = typeof routePayload === 'object'

      return isRoutePayloadObject ? !!Object.keys(routePayload).length : !!routePayload
    },

    getTdClasses (row) {
      return {
        'qas-table-generator__td--has-action': this.hasRowRoute(row)
      }
    },

    getTdChildComponentProps (row) {
      if (!this.hasRowRoute(row) || this.skeleton) return

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
      if (this.skeleton) return

      this.$attrs.onRowClick(...arguments)
    },

    tdChildComponent (row) {
      if (this.useExternalLink) return 'a'

      return this.hasRowRoute(row) ? 'router-link' : 'span'
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

    /**
     * Retorna propriedades para o componente QasSkeleton usado nas células do QasTableGenerator
     *
     * @param {string} column - nome da coluna
     * @param {Object} row - dados da linha
     */
    getTgSkeletonProps (column, row) {
      const normalizedFieldsProps = typeof this.fieldsProps === 'function'
        ? this.fieldsProps(row)
        : this.fieldsProps || {}

      const columnFieldProps = normalizedFieldsProps[column]

      const min = 100
      const max = 160

      // Gera uma largura aleatória entre min e max entre 100 e 160 pixels
      const width = Math.floor(Math.random() * (max - min + 1)) + min

      const isActions = column === 'actions'

      // Define o tipo do skeleton baseado na configuração da coluna
      const type = (
        (isActions ? 'QasActionsMenu' : undefined) ||
        columnFieldProps?.component ||
        (this.useMultiline ? undefined : 'text')
      )

      return {
        type,

        // se for multiline e não for actions, define a altura do skeleton
        height: this.useMultiline && !isActions ? '68px' : undefined,

        // Define a largura do skeleton
        width: columnFieldProps?.component || isActions ? undefined : `${width + 20}px`
      }
    },

    /**
     * Retorna propriedades para o componente QasSkeleton usado nos cabeçalhos do QasTableGenerator
     */
    getThSkeletonProps () {
      const min = 60
      const max = 120

      // Gera uma largura aleatória entre min e max entre 60 e 120 pixels
      const width = Math.floor(Math.random() * (max - min + 1)) + min

      return {
        type: 'text',
        useContrast: true,
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
      @include set-typography($subtitle2);

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

      line-height: 100% !important;
      padding-bottom: var(--qas-spacing-sm);;
      padding-left: 0;
      padding-right: var(--qas-spacing-md);
      padding-top: 0;
    }

    td,
    th,
    thead,
    tr {
      border-color: $grey-4;
    }

    td {
      @include set-typography($body2);

      height: 40px;
      padding-bottom: var(--qas-spacing-sm);
      padding-left: 0;
      padding-top: var(--qas-spacing-sm);
      position: relative;
      z-index: 0;
      padding-right: var(--qas-spacing-md);

      * {
        line-height: 100% !important;
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

  &--multiline {
    @media (min-width: $breakpoint-sm) {
      .q-table td {
        *:not(.qas-btn, .qas-btn *, .q-badge, .q-badge *){
          white-space: normal;
          overflow-wrap: anywhere;
        }
      }
    }
  }

  .q-table__container {
    margin-left: calc(var(--qas-spacing-md) * -1);
    margin-right: calc(var(--qas-spacing-md) * -1);
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
