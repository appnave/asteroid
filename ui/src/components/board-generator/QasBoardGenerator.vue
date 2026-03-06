<template>
  <div>
    <qas-grabbable class="qas-board-generator" v-bind="grabbableProps">
      <div ref="columnsContainer" class="no-wrap q-gutter-md q-pb-xs q-px-lg row">
        <qas-lazy-loading-components v-model:visible-items="visibleItems" direction="horizontal" placeholder-width="350px" :threshold="0">
          <qas-box v-for="(header, index) in normalizedHeaders" :key="index" :class="getColumnClass(header)" :style="containerStyle">
            <div class="ellipsis q-mb-md text-grey-10" v-bind="headerBoxProps">
              <qas-skeleton v-if="props.skeleton" type="text" use-contrast width="80%" />

              <slot v-else :fields="getFieldsByHeader(header)" :header="header" :index="index" name="header-column" />
            </div>

            <pv-board-generator-cards-container ref="columnContainer" class="qas-board-generator__column secondary-scroll" v-bind="getCardsContainerProps(header)">
              <!-- COLUNA COM ERRO -->
              <div v-if="columnsWithError[getKeyByHeader(header)]" class="column full-height items-center justify-center">
                <div class="text-center">
                  <q-icon color="negative" name="sym_r_error" size="md" />

                  <div class="q-mt-sm text-subtitle1">
                    {{ props.errorColumnText }}
                  </div>
                </div>

                <div class="text-center">
                  <qas-btn class="q-mt-md" icon="sym_r_refresh" label="Tentar novamente" :loading="columnsLoading[getKeyByHeader(header)]" @click="fetchColumn(header, true)" />
                </div>
              </div>

              <template v-else>
                <qas-lazy-loading-components :threshold="0">
                  <div v-for="(item) in getItemsByHeader(header)" :id="item[props.itemIdKey]" :key="item[props.itemIdKey]" class="qas-board-generator__item">
                    <!-- <slot v-if="!props.skeleton" :column-index="index" :fields="getFieldsByHeader(header)" :header="header" :item="item" name="column-item" /> -->
                    <qas-card v-if="updatingPositionItemKey === item[props.itemIdKey]" v-bind="skeletonCards.at(0)" :key="item[props.itemIdKey]" class="q-mb-sm" :column-index="index">
                      <template #default />
                    </qas-card>

                    <slot v-else-if="!props.skeleton && updatingPositionItemKey !== item[props.itemIdKey]" :column-index="index" :fields="getFieldsByHeader(header)" :header="header" :item="item" name="column-item" />
                  </div>
                </qas-lazy-loading-components>

                <div class="full-width justify-center row">
                  <qas-btn v-if="hasSeeMore(header)" icon="sym_r_add" :label="props.seeMoreButtonLabel" :loading="columnsLoading[getKeyByHeader(header)]" :use-label-on-small-screen="false" variant="tertiary" @click="fetchColumn(header, true)" />

                  <template v-if="hasSkeletonByHeader(header)">
                    <div class="q-col-gutter-y-sm row">
                      <div v-for="item in skeletonCards" :key="item[props.itemIdKey]" class="col-12">
                        <qas-card v-bind="item">
                          <template #default />
                        </qas-card>
                      </div>
                    </div>
                  </template>
                </div>

                <qas-empty-result-text v-if="hasEmptyResultText(header)" />
              </template>
            </pv-board-generator-cards-container>
          </qas-box>
        </qas-lazy-loading-components>
      </div>

      <qas-dialog v-model="showConfirmDialog" v-bind="defaultConfirmDialogProps" />
    </qas-grabbable>

    <q-inner-loading :showing="loading">
      <q-spinner
        color="grey"
        size="3em"
      />
    </q-inner-loading>
  </div>
</template>

<script setup>
import PvBoardGeneratorCardsContainer from './private/PvBoardGeneratorCardsContainer.vue'

import QasSkeleton from '../skeleton/QasSkeleton.vue'
import QasCard from '../card/QasCard.vue'
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasDialog from '../dialog/QasDialog.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasGrabbable from '../grabbable/QasGrabbable.vue'
import QasLazyLoadingComponents from '../lazy-loading-components/QasLazyLoadingComponents.vue'

import { ref, watch, computed, onUnmounted, markRaw, inject, onMounted, nextTick } from 'vue'
import promiseHandler from '../../helpers/promise-handler'
import NotifyError from '../../plugins/notify-error/NotifyError'

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

  errorColumnText: {
    type: String,
    default: 'Não foi possível carregar os itens desta coluna.'
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

  loading: {
    type: Boolean
  },

  columnWidth: {
    type: String,
    default: '350px'
  },

  seeMoreButtonLabel: {
    type: String,
    default: 'Ver mais'
  },

  sortableConfig: {
    type: Object,
    default: () => ({})
  },

  skeleton: {
    type: Boolean,
    default: true
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
    type: [String, Function],
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

defineExpose({ fetchColumns, fetchColumn, reset, cancelDrop, refreshColumn })

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
const isLoadingFromSeeMore = ref(false)
const columnsWithError = ref({})
const updatingPositionItemKey = ref(null)

/**
 * Índices das colunas visíveis no viewport
 * Populado pelo QasLazyLoadingComponents via v-model:visible-items
 */
const visibleItems = ref([])

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

// consts
const hasDragAndDrop = !!props.useDragAndDropX || !!props.useDragAndDropY

const grabbableProps = {
  useScrollBar: true,

  ...(hasDragAndDrop && {
    cancelMouseDownTarget: 'qas-board-generator__item'
  })
}

/**
 * Gera cards de skeleton para exibir enquanto carrega os itens da coluna, o mesmo é usado para preencher a coluna
 * quando a prop "skeleton" for true, indicando que é para simular o carregamento.
 */
const skeletonCards = Array.from({ length: 6 }).map(() => ({
  skeleton: true,
  title: '-',
  expansionProps: { label: '-' },
  actionsMenuProps: { list: {} },
  useSelection: true
}))

// computeds
const columnContainerElements = computed(() => {
  return columnContainer.value?.map(columnProxy => columnProxy.$el) || []
})

const normalizedHeaders = computed(() => {
  // retorna dados fakes para criar colunas de skeleton, caso a prop skeleton seja true.
  if (props.skeleton) {
    return Array.from({ length: 4 }).map((_, index) => {
      return {
        [props.columnIdKey]: `${props.columnIdKey}-${index}`
      }
    })
  }

  return props.headers
})

// Watchers
watch(
  () => isFetchSuccessHeader.value,
  value => {
    /**
     * isFetchSuccessHeader é uma variável que pego do listView por inject/provide, no qual caso eu faça request do header e dê sucesso, eu chamo as demais funções.
     * Valido se não houve sucesso na requisição do header ou se não é uma atualização de posição, para assim não bater novamente nas colunas apenas no header.
     */
    if (!value || isUpdatingPosition.value) return

    fetchColumnsValues()
  }
)

watch(
  () => normalizedHeaders.value,
  () => {
    if (isUpdatingPosition.value) return

    isUpdatingPosition.value = false
  }
)

watch(() => columnContainerElements.value, () => {
  setColumnHeightContainer()
  handleElementsList()
})

/**
 * Dispara o fetch inicial quando as colunas visíveis são detectadas pela primeira vez.
 * Usado no fluxo sem listView (onMounted não chama mais fetchColumnsValues diretamente).
 */
watch(visibleItems, () => {
  if (isInsideListView || props.skeleton) return

  fetchColumnsValues()
}, { once: true })

// hooks
onMounted(() => {
  window.addEventListener('resize', setColumnHeightContainer)
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
  // Primeira etapa: calcula e aplica a altura inicial de cada coluna
  columnContainerElements.value.forEach(columnElement => {
    // Pega a posição atual da coluna em relação ao topo da viewport
    const rect = columnElement.getBoundingClientRect()
    const heightToTop = rect.top

    // clientHeight dá a altura da viewport SEM incluir as scrollbars
    const viewportHeight = document.documentElement.clientHeight

    // Padding inferior aplicado no container para dar espaçamento visual
    const paddingBottom = 8

    // Calcula quanto de espaço temos disponível do topo da coluna até o fim da tela
    const availableHeight = viewportHeight - heightToTop - paddingBottom

    // Aplica essa altura na coluna
    columnElement.style.height = `${availableHeight}px`
  })

  // Segunda etapa: após o DOM atualizar, verifica se algum scroll vertical foi criado
  nextTick(() => {
    /**
     * scrollHeight é a altura total do conteúdo (incluindo o que não está visível)
     * clientHeight é a altura visível da viewport
     * Se scrollHeight > clientHeight, significa que há conteúdo "sobrando" e foi criado scroll vertical.
     */
    const hasVerticalScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight

    if (hasVerticalScroll) {
      // Calcula exatamente quantos pixels estão "sobrando" e causando o scroll
      const adjustment = document.documentElement.scrollHeight - document.documentElement.clientHeight

      // Reduz a altura de todas as colunas pelo valor exato do scroll + 2px de margem de segurança
      columnContainerElements.value.forEach(columnElement => {
        const safetyMargin = 2

        const currentHeight = parseInt(columnElement.style.height, 10)
        columnElement.style.height = `${currentHeight - adjustment - safetyMargin}px`
      })
    }
  })
}

/*
* Bater API pra cada header
* Etapa 1: faz as requests das colunas visíveis no carregamento inicial
* Etapa 2: após finalizar, faz as requests das colunas não visíveis
*/
async function fetchColumns () {
  if (props.skeleton) return

  // Mapeia os índices visíveis para os IDs de coluna correspondentes
  const visibleKeys = new Set(visibleItems.value.map(i => getKeyByHeader(normalizedHeaders.value[i])))

  const visibleHeaders = visibleKeys.size
    ? normalizedHeaders.value.filter(header => visibleKeys.has(getKeyByHeader(header)))
    : normalizedHeaders.value

  const hiddenHeaders = visibleKeys.size
    ? normalizedHeaders.value.filter(header => !visibleKeys.has(getKeyByHeader(header)))
    : []

  // Etapa 1: colunas visíveis (prioridade)
  const visibleColumns = await Promise.allSettled(visibleHeaders.map(header => fetchColumn(header, false)))

  // Etapa 2: colunas não visíveis (só executa após etapa 1 finalizar, menor prioridade)
  const hiddenColumns = await Promise.allSettled(hiddenHeaders.map(header => fetchColumn(header, false)))

  const allPromises = [...visibleColumns, ...hiddenColumns]

  const hasAllPromisesSucceeded = allPromises.every(promise => promise.status === 'fulfilled')
  const hasAllPromisesFailed = allPromises.length > 0 && allPromises.every(promise => promise.status === 'rejected')

  if (hasAllPromisesFailed) {
    emit('fetch-columns-error')

    NotifyError('Ocorreu um erro ao carregar as colunas. Tente novamente mais tarde.')

    return
  }

  if (hasAllPromisesSucceeded) {
    emit('fetch-columns-success')
  }

  if (hasDragAndDrop) handleElementsList()
}

/*
* Busca a coluna com base no header recebido.
*/
async function fetchColumn (header, fromSeeMore, setEr) {
  const headerKey = getKeyByHeader(header)
  const { limit, offset } = columnsPagination.value[headerKey] || {}

  isLoadingFromSeeMore.value = fromSeeMore

  const { data: response, error } = await promiseHandler(
    axios.get(`${props.columnUrl}/${headerKey}/${setEr ? 'setError' : ''}`, {
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
      useLoading: false
    }
  )

  isLoadingFromSeeMore.value = false

  if (error) {
    emit('fetch-column-error', error)

    columnsWithError.value[headerKey] = true

    throw error
  }

  columnsWithError.value[headerKey] = false

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

function refreshColumn (header) {
  const headerKey = getKeyByHeader(header)

  columnsResultsModel.value[headerKey] = []
  columnsPagination.value[headerKey] = { limit: props.limitPerColumn, offset: 0 }

  fetchColumn(header)
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
  return normalizedHeaders.value.find(header => String(getKeyByHeader(header)) === String(id))
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

  normalizedHeaders.value.forEach(header => {
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
  if (props.skeleton) return false

  return !columnsLoading.value[getKeyByHeader(header)] && !getItemsByHeader(header)?.length && !isDragging.value
}

/*
* Valida se o tamanho dos itens da coluna é menor que o valor total de itens que o back retorna e
* se a coluna não está em carregamento.
*/
function hasSeeMore (header) {
  const headerKey = getKeyByHeader(header)
  const hasMorePagination = columnsResultsModel.value[headerKey]?.length < columnsPagination.value[headerKey]?.count

  return hasMorePagination
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
  columnContainerElements.value.forEach((columnElement, index) => {
    // não adiciona os elementos com erro para o drag and drop.
    if (columnElement.dataset.hasError === 'true') return

    const sortable = setSortable(columnElement, index)

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
    group: 'shared',
    ghostClass: 'ghost',
    sort: false,
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
  console.log('🚀 ~ removeItemFromList ~ itemIndex:', itemIndex)

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

  updatingPositionItemKey.value = itemId

  const isFnUpdatePositionUrl = typeof props.updatePositionUrl === 'function'

  isLoadingFromSeeMore.value = true

  const url = isFnUpdatePositionUrl
    ? props.updatePositionUrl({ newHeaderKey, oldHeaderKey, itemId })
    : `${props.updatePositionUrl}/${itemId}/update-position`

  const { data, error } = await promiseHandler(
    axios.patch(url, params),
    {
      errorMessage: 'Ocorreu um erro ao atualizar a posição de seu item.',
      useLoading: false,
      onLoading: value => {
        isLoadingUpdatePosition.value = value

        columnsLoading.value[newHeaderKey] = value
      }
    }
  )

  updatingPositionItemKey.value = null

  if (error) {
    onCancelDrop.value()

    emit('update-error', error)

    return
  }

  /**
   * Reverte a mutação de DOM feita pelo SortableJS antes de atualizar os dados reativos.
   *
   * O SortableJS move elementos físicos do DOM imediatamente ao soltar o card,
   * mas o virtual DOM do Vue ainda "pensa" que eles estão na posição original.
   * Se atualizarmos os dados reativos sem primeiro restaurar o DOM, o Vue irá
   * patchar os elementos errados (ex: sobrescreve o card movido com os dados do
   * próximo card da coluna de origem), causando exibição incorreta.
   *
   * Ao reverter o DOM para o estado pré-drag, o Vue parte de um estado consistente
   * e renderiza corretamente a nova ordenação via dados reativos.
   */
  if (props.useDragAndDropX) {
    event.from.insertBefore(event.item, event.from.children[event.oldIndex] || null)
  }

  if (props.useDragAndDropY) {
    const oldIndex = event.oldIndex
    const targetIndex = oldIndex === 0 ? oldIndex : oldIndex + 1
    const insertBeforeElement = targetIndex < event.from.children.length
      ? event.from.children[targetIndex]
      : null

    event.from.insertBefore(event.item, insertBeforeElement)
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

function hasSkeletonByHeader (header) {
  const headerKey = getKeyByHeader(header)

  return (props.skeleton || columnsLoading.value[headerKey]) && !isLoadingFromSeeMore.value
}

function getColumnClass (header) {
  const headerKey = getKeyByHeader(header)

  return {
    'qas-board-generator__column-error': columnsWithError.value[headerKey]
  }
}

function getCardsContainerProps (header) {
  const headerKey = getKeyByHeader(header)

  return {
    'data-header-key': headerKey,
    'data-has-error': columnsWithError.value[headerKey]
  }
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

  &__column-error {
    border: 1px solid $negative;
  }
}
</style>
