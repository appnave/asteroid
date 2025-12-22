<template>
  <qas-grabbable class="qas-board-generator" v-bind="grabbableProps">
    <div class="no-wrap q-col-gutter-sm q-px-xl row">
      <div v-for="(header, index) in headers" :key="index" class="q-mr-sm">
        <qas-box class="q-mb-md" v-bind="headerBoxProps">
          <slot :fields="getFieldsByHeader(header)" :header="header" :index="index" name="header-column" />
        </qas-box>

        <div ref="columnContainer" class="qas-board-generator__column secondary-scroll" :data-header-key="getKeyByHeader(header)" :style="containerStyle">
          <div v-for="item in getItemsByHeader(header)" :id="item[props.itemIdKey]" :key="item[props.itemIdKey]" class="qas-board-generator__item">
            <slot :column-index="index" :fields="getFieldsByHeader(header)" :item="item" name="column-item" />
          </div>

          <div class="full-width justify-center row">
            <qas-btn v-if="hasSeeMore(header)" icon="sym_r_add" label="Ver mais" :use-label-on-small-screen="false" variant="tertiary" @click="fetchColumn(header)" />

            <q-spinner v-if="columnsLoading[getKeyByHeader(header)]" class="q-mb-md" color="grey-4" size="3em" />
          </div>

          <qas-empty-result-text v-if="hasEmptyResultText(header)" />
        </div>
      </div>
    </div>

    <qas-dialog v-model="showConfirmDialog" v-bind="defaultConfirmDialogProps" />
  </qas-grabbable>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasDialog from '../dialog/QasDialog.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasGrabbable from '../grabbable/QasGrabbable.vue'

import { ref, watch, computed, onUnmounted, markRaw, inject, onMounted } from 'vue'
import promiseHandler from '../../helpers/promise-handler'

import Sortable from 'sortablejs'

defineOptions({ name: 'QasBoardGenerator' })

const props = defineProps({
  beforeUpdatePosition: {
    type: Function,
    default: undefined
  },

  headers: {
    type: Array,
    default: () => []
  },

  results: {
    type: Object,
    default: () => ({})
  },

  headerBoxProps: {
    type: Object,
    default: () => ({})
  },

  columnIdKey: {
    type: String,
    required: true
  },

  columnParams: {
    type: Object,
    default: () => ({})
  },

  columnUrl: {
    type: String,
    required: true
  },

  confirmDialogProps: {
    type: Object,
    default: () => ({})
  },

  height: {
    type: String,
    default: ''
  },

  itemIdKey: {
    type: String,
    default: ''
  },

  limitPerColumn: {
    type: Number,
    default: 12
  },

  columnWidth: {
    type: String,
    default: '300px'
  },

  sortableConfig: {
    type: Object,
    default: () => ({})
  },

  useMarkRaw: {
    type: Boolean,
    default: true
  },

  useDragAndDropX: {
    type: Boolean
  },

  useDragAndDropY: {
    type: Boolean
  },

  updatePositionUrl: {
    type: String,
    default: ''
  },

  updatePositionParams: {
    type: Object,
    default: () => ({})
  },

  lazyLoadingFieldsKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:results',
  'fetch-column-success',
  'fetch-column-error',
  'fetch-columns-success',
  'fetch-columns-error',
  'update-success',
  'update-error'
])

defineExpose({ fetchColumns, fetchColumn, reset, cancelDrop })

// Inject
const axios = inject('axios')

const isFetchSuccessHeader = inject('isFetchListSucceeded', false)

const isInsideListView = inject('isListView', false)

// Refs
const columnContainer = ref(null)
const columnsPagination = ref({})
const columnsLoading = ref({})
const columnsFieldsModel = ref({})
const showConfirmDialog = ref(false)
const isDragging = ref(false)
const isLoadingUpdatePosition = ref(false)

/**
 * Instâncias do sortable, que são utilizadas para realizar o destroy ao sair da página
 */
const sortableInstances = ref([])

/**
 * Callbacks que recebe o event de movimentação
 */
const onCancelDrop = ref(() => {})
const onConfirmDrop = ref(() => {})

/**
 * Variável auxiliar que controla quando estou atualizando o header em caso de drag and drop
 */
const isUpdatingPosition = ref(false)

// Consts
const hasDragAndDrop = !!props.useDragAndDropX || !!props.useDragAndDropY

const grabbableProps = {
  useScrollBar: true,

  ...(hasDragAndDrop && {
    cancelMouseDownTarget: 'qas-board-generator__item'
  })
}

// Watchers
watch(
  () => isFetchSuccessHeader.value,
  value => {
    /**
     * isFetchSuccessHeader é uma variavel que pego do listView por inject/provide, no qual caso eu faça request do header e dê sucesso, eu chamo as demais funções.
     * Valido se não houve sucesso na requisição do header ou se não é uma atualização de posição, para assim não bater novamente nas colunas apenas no header.
     */
    if (!value || isUpdatingPosition.value) return

    fetchColumnsValues()
  }
)

watch(
  () => props.headers,
  () => {
    if (isUpdatingPosition.value) return

    isUpdatingPosition.value = false
  }
)

watch(columnContainer, setColumnHeightContainer)

// Lifecycles
onMounted(() => {
  /**
   * Caso eu use o listView (valor pego por provide), a request é feito pelo watch quando se ocorre o sucesso do `fetchList`
   */
  if (isInsideListView) return

  fetchColumnsValues()
})

onUnmounted(destroySortable)

// Computeds
const columnsResultsModel = computed({
  get () {
    return props.results
  },

  set (newValues) {
    emit('update:results', newValues)
  }
})

const hasColumnsLength = computed(() => !!Object.keys(columnsResultsModel.value).length)

const containerStyle = computed(() => `width: ${props.columnWidth};`)

const hasConfirmDialogProps = computed(() => !!Object.keys(props.confirmDialogProps).length)

const defaultConfirmDialogProps = computed(() => {
  const defaultProps = {
    ok: {
      label: 'Confirmar',
      onClick: onConfirmDrop.value,
      loading: isLoadingUpdatePosition.value
    },

    cancel: {
      onClick: onCancelDrop.value
    }
  }

  return {
    ...props.confirmDialogProps,
    ...defaultProps
  }
})

// functions
/*
* Setar o tamanho do container do board, onde deverá ser a altura passada via prop, ou o default será ocupar o maximo
* de espaço que ele conseguir considerando a altura do container em relação ao topo.
*/
function setColumnHeightContainer () {
  columnContainer.value?.forEach(columnElement => {
    const heightToTop = columnElement?.getBoundingClientRect()?.top
    const paddingSpacing = 60
    const value = heightToTop + paddingSpacing

    columnElement.style.setProperty('height', props.height ? props.height : `calc(100vh - ${value}px)`)
  })
}

/*
* Bater API pra cada header
*/
async function fetchColumns () {
  const promises = props.headers.map(header => fetchColumn(header))

  const { error } = await promiseHandler(promises, { useLoading: false })

  if (error) {
    emit('fetch-columns-error', error)

    return
  }

  emit('fetch-columns-success')

  if (hasDragAndDrop) handleElementsList()
}

/*
* Busca a coluna com base no header recebido.
*/
async function fetchColumn (header) {
  const headerKey = getKeyByHeader(header)
  const { limit, offset } = columnsPagination.value[headerKey] || {}

  const { data: response, error } = await promiseHandler(
    axios.get(`${props.columnUrl}/${headerKey}`, {
      params: {
        ...props.columnParams,
        limit,
        offset
      }
    }),
    {
      onLoading: value => {
        columnsLoading.value[headerKey] = value
      },
      useLoading: false,
      errorMessage: 'Não conseguimos buscar as colunas do board. Por favor, tente novamente em alguns minutos.'
    }
  )

  if (error) {
    emit('fetch-column-error', error)

    throw error
  }

  const newValues = response.data?.results || []
  const resultsModel = columnsResultsModel.value[headerKey] || []

  const newColumnValues = [
    ...resultsModel,
    ...newValues
  ]

  /**
   * exemplo de como columnsResultsModel irá ficar:
   *
   * {
   *  '2024-02-15': [...],
   *  '2024-02-16': [...]
   * }
   *
   * onde cada item do objeto é uma coluna no board. O mesmo vale para "columnsFieldsModel", "columnsLoading" e
   * "columnPagination", organizando os fields, loadings e o controle de paginação por chave identificadora do header.
   */
  columnsResultsModel.value[headerKey] = props.useMarkRaw ? markRaw(newColumnValues) : newColumnValues

  /*
  * Pode acontecer das options nos fields da segunda página serem diferentes da primeira página,
  * portanto deve ocorrer o merge.
  */
  if (response.data?.fields) {
    columnsFieldsModel.value[headerKey] = markRaw(
      getMergedFields(columnsFieldsModel.value[headerKey], response.data?.fields)
    )
  }

  columnsPagination.value[headerKey].offset = columnsResultsModel.value[headerKey].length
  columnsPagination.value[headerKey].count = response.data?.count

  emit('fetch-column-success', { response, header })
}

/*
* Mergeia os options antigos com os novos de cada field.
*/
function getMergedFields (oldFields, newFields) {
  // Primeira vez batendo a API, retorna os novos fields.
  if (!oldFields || !props.lazyLoadingFieldsKeys.length) return newFields

  // Caso bata a API e por algum motivo não venha fields, mantenha o antigos.
  if (oldFields && !newFields) return oldFields

  const mergedFields = { ...oldFields }

  props.lazyLoadingFieldsKeys.forEach(fieldKey => {
    mergedFields[fieldKey].options = getNonDuplicatedOptions(oldFields[fieldKey].options, newFields[fieldKey].options)
  })

  return mergedFields
}

/*
* Tratamento para fazer o merge e evitar options duplicados.
*/
function getNonDuplicatedOptions (oldOptions, newOptions) {
  const options = [...oldOptions]

  newOptions.forEach(item => {
    const hasOption = options.find(option => option.value === item.value)

    if (!hasOption) options.push(item)
  })

  return options
}

function getItemsByHeader (header) {
  return hasColumnsLength.value ? columnsResultsModel.value[getKeyByHeader(header)] : []
}

function getColumnItemById (id) {
  return Object.values(columnsResultsModel.value).flat().find(item => item[props.itemIdKey] === id)
}

/**
 * Recupera o payload do header por id:
 *
 * @example getHeaderById('2024-02-15')
 * @returns {Object} // { date: '2024-02-15'... }
 */
function getHeaderById (id) {
  return props.headers.find(header => String(getKeyByHeader(header)) === String(id))
}

/**
* Pegar key com base na chave identificador, exemplo:
* header -> { date: '2024-02-12', ... }
* columnIdKey -> 'date'
* retorno -> '2024-02-12'
*
* Onde esta chave será o "id" da coluna, sendo usado para bater a API, lidar com paginação, loading, etc.
*
* @example getKeyByHeader({ date: '2024-02-12', ... })
* @returns {string} // '2024-02-12'
*/
function getKeyByHeader (header = {}) {
  return header[props.columnIdKey]
}

/*
* Para cada header, irá ser criado um item com sua chave identificadora para lidar com paginação e loading.
* columnsPagination -> { '2024-02-15': { limit: 12, offset: 0 }, '2024-02-16': { limit: 12, offset: 0 }, ... }
* columnsLoading ->{ '2024-02-15': false, '2024-02-16': false, ... }
*/
function setColumnsPagination () {
  columnsPagination.value = {}
  columnsLoading.value = {}

  props.headers.forEach(header => {
    const headerKey = getKeyByHeader(header)

    columnsPagination.value[headerKey] = { limit: props.limitPerColumn, offset: 0 }
    columnsLoading.value[headerKey] = false
  })
}

function fetchColumnsValues () {
  reset()
  setColumnHeightContainer()
  setColumnsPagination()
  fetchColumns()
}

/**
 * Descricao:
 * Exibe o texto quando:
 * - Nao esta carregando a coluna
 * - Nao tem itens na coluna
 * - Nao estou fazendo o drag and drop
 *
 * @param {Object} header
 */
function hasEmptyResultText (header) {
  return !columnsLoading.value[getKeyByHeader(header)] && !getItemsByHeader(header)?.length && !isDragging.value
}

/*
* Valida se o tamanho dos itens da coluna é menor que o valor total de itens que o back retorna e
* se a coluna não está em carregamento.
*/
function hasSeeMore (header) {
  const headerKey = getKeyByHeader(header)
  const hasMorePagination = columnsResultsModel.value[headerKey]?.length < columnsPagination.value[headerKey]?.count

  return hasMorePagination && !columnsLoading.value[headerKey]
}

function reset () {
  columnsResultsModel.value = {}
  columnsPagination.value = {}
  columnsLoading.value = {}
}

function getFieldsByHeader (header) {
  const headerKey = getKeyByHeader(header)

  return columnsFieldsModel.value[headerKey] || {}
}

/**
 * Loopa todos os itens da coluna com base no ref para pegar o elemento HTML e setar e instaciar o sortable.
 */
function handleElementsList () {
  columnContainer.value.forEach((element, index) => {
    const sortable = setSortable(element, index)

    sortableInstances.value.push(sortable)
  })
}

/**
 * Descrição:
 * Seta a instancia do sortable, no qual varia de acordo com as props passadas.
 *
 * @param {HTMLElement} element
 * @param {Number} index
 */
function setSortable (element, index) {
  const defaultSortableConfig = {
    animation: 500,
    swapThreshold: 1,
    delay: 50,
    delayOnTouchOnly: true,
    emptyInsertThreshold: 0
  }

  /**
   * Caso seja apenas drag and drop no eixo Y
   */
  const useOnlyDragAndDropY = !!props.useDragAndDropY && !props.useDragAndDropX

  const sortable = new Sortable(element, {
    sort: props.useDragAndDropY,

    ...defaultSortableConfig,

    ...props.sortableConfig,

    group: useOnlyDragAndDropY ? `column-${index}` : 'shared',

    direction: useOnlyDragAndDropY ? 'vertical' : 'horizontal',

    onStart: toggleIsDragging,

    onAdd: event => onDropCard(event),

    ...(props.useDragAndDropY && {
      onSort: event => onDropCard(event)
    })
  })

  return sortable
}

function toggleIsDragging () {
  isDragging.value = !isDragging.value
}

function onDropCard (event) {
  onCancelDrop.value = () => cancelDrop(event)

  onConfirmDrop.value = () => confirmDrop(event)

  if (typeof props.beforeUpdatePosition === 'function') {
    props.beforeUpdatePosition({
      event,
      cancel: onCancelDrop.value,
      getItem: () => getColumnItemById(event.item.id),
      getColumnTo: () => getHeaderById(event.to.dataset.headerKey),
      getColumnFrom: () => getHeaderById(event.from.dataset.headerKey),
      openConfirmDialog,
      update: () => confirmDrop(event)
    })

    return
  }

  hasConfirmDialogProps.value
    ? openConfirmDialog()
    : confirmDrop(event)
}

function openConfirmDialog () {
  showConfirmDialog.value = true
}

function closeConfirmDialog () {
  showConfirmDialog.value = false
}

/**
 * @param {event} event
 */
function cancelDrop (event) {
  /**
   * Insere na posição antiga que pertencia (event.oldIndex) dentro do seu antigo pai (event.from)
   */
  if (props.useDragAndDropX) event.from.insertBefore(event.item, event.from.children[event.oldIndex])

  if (props.useDragAndDropY) {
    const oldIndex = event.oldIndex

    /**
     * Se oldIndex for 0, o targetIndex deverá ser 0, pois isso indica que se o item é o primeiro da lista, ele não será movido para outra posição.
     *
     * Caso o oldIndex for diferente, devo incrementar 1 para adicionar, pois isso permite que o item seja inserido logo após sua posição original.
     */
    const targetIndex = oldIndex === 0 ? oldIndex : oldIndex + 1

    /**
     * Verifica se o índice alvo é válido, caso contrário, define como o final
     */
    const insertBeforeElement = targetIndex < event.from.children.length
      ? event.from.children[targetIndex]
      : null

    event.from.insertBefore(event.item, insertBeforeElement)
  }

  if (hasConfirmDialogProps.value) closeConfirmDialog()

  toggleIsDragging()
}

function confirmDrop (event) {
  const { from, to, item: { id: itemId } } = event

  const { headerKey: newHeaderKey } = to.dataset
  const { headerKey: oldHeaderKey } = from.dataset

  updatePosition({ newHeaderKey, oldHeaderKey, itemId, event })
}

/**
 *
 * @param {{
 *  headerKey: string,
 *  itemId: string
 * }}
 */
function removeItemFromList ({ headerKey, itemId }) {
  /**
   * Coluna referente ao model de resultado
   */
  const columnItemList = columnsResultsModel.value[headerKey]

  /**
   * Busca o item com base em seu ID na lista de itens da coluna
   */
  const itemIndex = columnItemList.findIndex(itemContent => itemContent[props.itemIdKey] === itemId)

  /**
   * Remove o item da listagem com base no index, sendo que preciso subtrair 1 para pegar o index correto
   */
  columnItemList.splice(itemIndex, 1)

  /**
   * Remove o item do count da coluna para não mostrar o botão de "Ver mais¨.
   */
  columnsPagination.value[headerKey].count -= 1
}

/**
 * Método que realiza a request de update
 *
 * @param {{
 *  newHeaderKey: string - ID da coluna de destino,
 *  oldHeaderKey: string - ID da antiga coluna,
 *  itemId: string - ID do meu item a ser movimento,
 *  event: event
 * }}
 */
async function updatePosition ({ newHeaderKey, oldHeaderKey, itemId, event }) {
  const params = {
    [props.columnIdKey]: newHeaderKey,
    ...(props.useDragAndDropY && { newIndex: event.newIndex }),
    ...props.updatePositionParams
  }

  const { data, error } = await promiseHandler(
    axios.patch(`${props.updatePositionUrl}/${itemId}/update-position`, params),
    {
      errorMessage: 'Ocorreu um erro ao atualizar a posição de seu item.',
      useLoading: false,
      onLoading: value => {
        isLoadingUpdatePosition.value = value

        columnsLoading.value[newHeaderKey] = value
      }
    }
  )

  if (error) {
    onCancelDrop.value()

    emit('update-error', error)

    return
  }

  removeItemFromList({ headerKey: oldHeaderKey, itemId })

  setItemList({ headerKey: newHeaderKey, data: data.data, index: event.newIndex })

  isUpdatingPosition.value = true

  toggleIsDragging()

  closeConfirmDialog()

  emit('update-success', data.data)
}

function setItemList ({ headerKey, data, index }) {
  /**
   * Coluna referente ao model de resultado
   */
  const columnItemList = columnsResultsModel.value[headerKey]

  /**
   * Adiciona o item na posição do event escolhido.
   */
  columnItemList.splice(index, 0, data.result)
}

function destroySortable () {
  sortableInstances.value.forEach(sortable => sortable.destroy())
}
</script>

<style lang="scss">
.qas-board-generator {
  max-height: 100vh;

  &__column {
    overflow-x: hidden;
    scrollbar-width: none;

    &:hover {
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        display: block;
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  // 60px é o valor do padding definido no container da column.
  &__column-items {
    height: calc(100% - 60px);
  }
}
</style>
