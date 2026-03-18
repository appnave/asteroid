<template>
  <div>
    <qas-grabbable class="qas-board-generator" v-bind="grabbableProps">
      <div ref="columnsContainer" class="no-wrap q-gutter-md q-pb-xs q-px-lg row">
        <qas-lazy-loading-components :key="lazyLoadingKey" v-model:visible-items="visibleItems" direction="horizontal" placeholder-width="350px" :threshold="0">
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
                  <div v-for="(item) in getItemsByHeader(header)" :id="item[props.itemIdKey]" :key="item[props.itemIdKey]" class="qas-board-generator__item" :data-disable-drag="updatingPositionItemKeys.has(item[props.itemIdKey])">
                    <slot v-if="!props.skeleton" :column-index="index" :fields="getFieldsByHeader(header)" :header="header" :is-updating-position="updatingPositionItemKeys.has(item[props.itemIdKey])" :item="item" name="column-item" />
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

import promiseHandler from '../../helpers/promise-handler'
import NotifyError from '../../plugins/notify-error/NotifyError'

import {
  ref,
  watch,
  computed,
  onBeforeUnmount,
  markRaw,
  inject,
  provide,
  onMounted,
  nextTick
} from 'vue'

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
    default: false
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

defineExpose({
  fetchColumns,
  fetchColumn,
  reset,
  cancelDrop,
  refreshColumn,
  transferItemToColumn,
  removeItemFromList,
  updateItemInList,
  refetchColumns: fetchColumnsValues
})

// globals
const axios = inject('axios')

// refs
const columnContainer = ref(null)
const columnsPagination = ref({})
const columnsLoading = ref({})
const columnsFieldsModel = ref({})
const showConfirmDialog = ref(false)
const isLoadingUpdatePosition = ref(false)
const isLoadingFromSeeMore = ref(false)
const columnsWithError = ref({})
const updatingPositionItemKeys = ref(new Set())

/**
 * Índices das colunas visíveis no viewport
 * Populado pelo QasLazyLoadingComponents via v-model:visible-items
 */
const visibleItems = ref([])

/**
 * Chave reativa para forçar o remount do QasLazyLoadingComponents externo.
 * Ao incrementar, o componente é destruído e recriado com estado limpo,
 * evitando render de VNodes obsoletos que causam crash.
 */
const lazyLoadingKey = ref(0)

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

/**
 * Contador de drags ativos. Usado em vez de um booleano com toggle para
 * evitar race conditions quando múltiplos drags acontecem em sequência rápida.
 * isDragging continua existindo como computed derivado deste contador.
 */
const draggingCount = ref(0)

/**
 * Fila de chamadas de updatePosition para garantir execução sequencial.
 * Cada entrada é uma função que retorna uma Promise (a chamada updatePosition).
 * Isso evita race conditions causadas por múltiplas requests concorrentes
 * que compartilham estado (updatingPositionItemKey, isLoadingUpdatePosition, etc).
 */
let updatePositionQueue = Promise.resolve()

/**
 * Mapa de AbortControllers por chave de coluna para cancelar requests em andamento.
 * Não é reativo pois não precisamos de reatividade sobre os controllers.
 */
let columnAbortControllers = {}

/**
 * Contador de sessão para o fetchColumns em execução.
 * Incrementado a cada nova chamada, permitindo que sessões antigas detectem que foram substituídas.
 */
let currentFetchColumnsSession = 0

/**
 * Estado do smooth scroll horizontal.
 * Acumula o target e interpola suavemente via requestAnimationFrame.
 */
const SMOOTH_SCROLL_LERP = 0.2

/**
 * Velocidade de scroll vertical (dentro da coluna), independente do scrollSpeed horizontal.
 * O offsetY recebido no scrollFn é proporcional ao scrollSpeed (60), então normalizamos
 * para que o scroll vertical se comporte como se scrollSpeed fosse 10 (padrão do SortableJS).
 */
const HORIZONTAL_SCROLL_SPEED = 60
const VERTICAL_SCROLL_SPEED = 20

/**
 * Sensibilidade para iniciar o scroll automático ao arrastar próximo às bordas do container.
 */
const HORIZONTAL_SCROLL_SENSITIVITY = 150
const VERTICAL_SCROLL_SENSITIVITY = 80

let smoothScrollTarget = 0
let smoothScrollRafId = null
let smoothScrollEl = null

/**
 * Geração por coluna para invalidar callbacks onLoading de requests canceladas.
 * Evita que o onLoading(false) de uma request cancelada sobrescreva o estado da nova request.
 */
const columnFetchGenerations = {}

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

// watchers
watch(
  () => normalizedHeaders.value,
  value => {
    if (isLoadingUpdatePosition.value || !value?.length) return

    fetchColumnsValues()
  }
)

watch(() => columnContainerElements.value, () => {
  setColumnHeightContainer()
  handleElementsList()
})

// hooks
onMounted(() => {
  if (normalizedHeaders.value.length) {
    fetchColumnsValues()
  }

  window.addEventListener('resize', setColumnHeightContainer)
})

onBeforeUnmount(() => {
  abortAllColumnRequests()
  destroySortable()

  window.removeEventListener('resize', setColumnHeightContainer)
})

// Computeds
const columnsResultsModel = computed({
  get () {
    return props.results
  },

  set (newValues) {
    emit('update:results', newValues)
  }
})

const isDragging = computed(() => draggingCount.value > 0)

provide('isDragging', isDragging)

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
  if (props.height) {
    columnContainerElements.value.forEach(columnElement => {
      columnElement.style.height = props.height
    })

    return
  }

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

  /**
   * Cada chamada a fetchColumns recebe um ID de sessão único.
   * Se um novo fetchColumnsValues for chamado durante a execução, a sessão anterior
   * detecta que foi substituída e para de processar, evitando emissão de eventos falsos.
   */
  const mySession = ++currentFetchColumnsSession

  // Mapeia os índices visíveis para os IDs de coluna correspondentes
  const visibleKeys = new Set(visibleItems.value.map(i => getKeyByHeader(normalizedHeaders.value[i])))

  const visibleHeaders = visibleKeys.size
    ? normalizedHeaders.value.filter(header => visibleKeys.has(getKeyByHeader(header)))
    : normalizedHeaders.value

  const hiddenHeaders = visibleKeys.size
    ? normalizedHeaders.value.filter(header => !visibleKeys.has(getKeyByHeader(header)))
    : []

  /**
   * Isto é necessário para setar o loading das colunas ocultas mesmo antes de elas serem visíveis
   * e suas requests serem feitas, garantindo que ao entrar no viewport elas já estejam com o estado
   * de loading correto, evitando bugs visuais.
   */
  hiddenHeaders.forEach(header => {
    const headerKey = getKeyByHeader(header)

    columnsLoading.value[headerKey] = true
  })

  // Etapa 1: colunas visíveis (prioridade)
  const visibleColumns = await Promise.allSettled(visibleHeaders.map(header => fetchColumn(header, false)))

  // Sessão foi substituída por um novo fetchColumnsValues — encerra sem emitir eventos
  if (currentFetchColumnsSession !== mySession) return

  // Etapa 2: colunas não visíveis (só executa após etapa 1 finalizar, menor prioridade)
  const hiddenColumns = await Promise.allSettled(hiddenHeaders.map(header => fetchColumn(header, false)))

  // Verifica novamente pois outro fetchColumnsValues pode ter sido chamado durante a etapa 2
  if (currentFetchColumnsSession !== mySession) return

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

  /**
   * Cancela qualquer request anterior para esta mesma coluna antes de iniciar a nova.
   * Garante que nunca haja duas requests paralelas para a mesma coluna.
   */
  abortColumnRequest(headerKey)

  /**
   * Incrementa a geração desta coluna para invalidar callbacks onLoading da request cancelada,
   * evitando que o onLoading(false) antigo sobrescreva o estado da nova request.
   * Usa ?? 0 pois ++undefined retorna NaN, e NaN === NaN é sempre false, travando o skeleton.
   */
  columnFetchGenerations[headerKey] = (columnFetchGenerations[headerKey] ?? 0) + 1
  const generation = columnFetchGenerations[headerKey]

  const abortController = new AbortController()
  columnAbortControllers[headerKey] = abortController

  const { limit, offset } = columnsPagination.value[headerKey] || {}

  isLoadingFromSeeMore.value = fromSeeMore

  const { data: response, error } = await promiseHandler(
    axios.get(`${props.columnUrl}/${headerKey}/${setEr ? 'setError' : ''}`, {
      signal: abortController.signal,
      params: {
        ...props.columnParams,
        limit,
        offset
      }
    }),
    {
      onLoading: value => {
        /**
         * Só atualiza o loading se ainda for a request atual desta coluna,
         * evitando que o onLoading(false) de uma request cancelada sobrescreva o da nova.
         */
        if (columnFetchGenerations[headerKey] === generation) {
          columnsLoading.value[headerKey] = value
        }
      },
      useLoading: false
    }
  )

  delete columnAbortControllers[headerKey]

  isLoadingFromSeeMore.value = false

  if (error) {
    // Request cancelada intencionalmente (novo fetchColumnsValues chamado): ignora silenciosamente.
    if (isCancelledError(error)) return

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
  columnsResultsModel.value[headerKey] = hasDragAndDrop ? newColumnValues : markRaw(newColumnValues)

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

    // Inicia como true para exibir skeleton imediatamente, evitando flash de tela vazia
    // entre o reset e o início das novas requests.
    columnsLoading.value[headerKey] = true
  })
}

function fetchColumnsValues () {
  // Cancela todas as requests em andamento antes de iniciar novas,
  // evitando resposta de requests antigas sobrescrevendo dados da nova sessão.
  abortAllColumnRequests()

  lazyLoadingKey.value++

  reset()
  setColumnHeightContainer()
  setColumnsPagination()
  fetchColumns()
}

/**
 * Descrição:
 * Exibe o texto quando:
 * - Nao esta carregando a coluna
 * - Nao tem itens na coluna
 * - Nao estou fazendo o drag and drop
 * - Nao esta exibindo o dialog de confirmação
 *
 * @param {Object} header
 */
function hasEmptyResultText (header) {
  if (props.skeleton) return false

  const headerKey = getKeyByHeader(header)
  const items = getItemsByHeader(header)

  return !columnsLoading.value[headerKey] && !items?.length && !isDragging.value && !showConfirmDialog.value
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
 * @param {number} index
 */
function setSortable (element, index) {
  const defaultSortableConfig = {
    animation: 150,
    group: 'shared',
    ghostClass: 'qas-board-generator__ghost',
    swapThreshold: 1,
    delay: 0,
    delayOnTouchOnly: true,
    emptyInsertThreshold: 0,
    filter: '[data-disable-drag="true"]',
    scrollSensitivity: HORIZONTAL_SCROLL_SENSITIVITY,
    scrollSpeed: HORIZONTAL_SCROLL_SPEED,
    bubbleScroll: true,
    forceAutoScrollFallback: true,
    scrollFn: handleSortableScroll
  }

  /**
   * Caso seja apenas drag and drop no eixo Y
   */
  const useOnlyDragAndDropY = !!props.useDragAndDropY && !props.useDragAndDropX

  /**
   * Flag local por instância do Sortable para rastrear se o drop foi tratado
   * pelo onAdd/onSort. Isso permite que o onEnd saiba se deve chamar stopDragging
   * (caso o usuário arraste e devolva o card sem mover para outra coluna).
   */
  let dropHandled = false

  const sortable = new Sortable(element, {
    ...defaultSortableConfig,

    ...props.sortableConfig,

    /**
     * `sort` deve vir APÓS os spreads para não ser sobrescrito pelo defaultSortableConfig.
     * Quando useDragAndDropY é true, o sort precisa estar habilitado para que o SortableJS
     * rastreie ativamente a posição do item dentro da coluna durante o drag. Sem isso,
     * o item oscila entre colunas porque o Sortable do destino não "assume" o controle do item.
     */
    sort: props.useDragAndDropY,

    group: useOnlyDragAndDropY ? `column-${index}` : 'shared',

    /**
     * invertSwap muda o algoritmo de swap: em vez de trocar quando o centro do item arrastado
     * cruza o centro do alvo (instável, causa oscilação), troca apenas quando cruza a BORDA
     * superior/inferior do alvo. Isso cria uma "zona morta" que elimina o jitter.
     */
    invertSwap: true,

    onStart: () => {
      dropHandled = false
      startDragging()
    },

    onAdd: event => {
      dropHandled = true
      onDropCard(event)
    },

    /**
     * Chamado sempre que o drag termina, independente do resultado.
     * Só chama stopDragging se onAdd/onSort não trataram o drop,
     * ou seja, o usuário abandonou o drag sem mover o card.
     */
    onEnd: () => {
      if (!dropHandled) stopDragging()
    },

    ...(props.useDragAndDropY && {
      onSort: event => {
        dropHandled = true

        /**
         * O SortableJS dispara onSort em AMBAS as listas envolvidas quando um item
         * é arrastado entre colunas (cross-column): na lista de origem porque perdeu
         * um item e na lista de destino porque ganhou um.
         * O onAdd já trata o cross-column na lista de destino, então ao ignorar o
         * onSort para eventos cross-column evitamos processar o mesmo drop duas vezes,
         * o que causava corrupção do model (item duplicado no destino e remoção
         * incorreta do último item da origem via splice(-1, 1)).
         */
        if (event.from !== event.to) return

        onDropCard(event)
      }
    })
  })

  return sortable
}

function startDragging () {
  draggingCount.value++
}

function stopDragging () {
  draggingCount.value = Math.max(0, draggingCount.value - 1)
  resetSmoothScroll()
}

/**
 * Intercepta cada chamada de scroll do SortableJS.
 * - Scroll vertical (colunas): retorna 'continue' para manter o comportamento nativo.
 * - Scroll horizontal (container do board): aplica smooth scroll via rAF.
 */
function handleSortableScroll (offsetX, offsetY, evt, _touchEvt, scrollEl) {
  // Obtém o container com scroll horizontal (`.qas-grabbable__container`).
  const horizontalContainer = columnContainerElements.value[0]?.closest('.qas-grabbable__container')

  // Acumula o offset no target e inicia a interpolação via rAF.
  if (scrollEl === horizontalContainer && offsetX) {
    if (smoothScrollEl !== scrollEl) {
      smoothScrollTarget = scrollEl.scrollLeft
      smoothScrollEl = scrollEl
    }

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth

    smoothScrollTarget = Math.max(0, Math.min(smoothScrollTarget + offsetX, maxScroll))

    if (!smoothScrollRafId) {
      smoothScrollRafId = requestAnimationFrame(smoothScrollStep)
    }
    return
  }

  /**
   * SortableJS chama essa função com offsets de scroll.
   * Para scroll vertical: retorna 'continue' para deixar o comportamento nativo.
   * Para scroll horizontal: aplica smooth scroll customizado via rAF.
   */
  if (offsetY) {
    const clientY = evt?.clientY ?? evt?.touches?.[0]?.clientY

    if (clientY !== undefined) {
      const rect = scrollEl.getBoundingClientRect()
      const distFromEdge = Math.min(clientY - rect.top, rect.bottom - clientY)

      if (distFromEdge > VERTICAL_SCROLL_SENSITIVITY) return
    }

    scrollEl.scrollTop += offsetY * (VERTICAL_SCROLL_SPEED / HORIZONTAL_SCROLL_SPEED)
    return
  }

  return 'continue'
}

/**
 * Loop de animação que interpola o scrollLeft em direção ao target
 * usando fator de lerp (move 20% da distância restante por frame).
 */
function smoothScrollStep () {
  smoothScrollRafId = null

  if (!smoothScrollEl) return

  const current = smoothScrollEl.scrollLeft
  const diff = smoothScrollTarget - current

  if (Math.abs(diff) < 0.5) {
    smoothScrollEl.scrollLeft = smoothScrollTarget
    return
  }

  smoothScrollEl.scrollLeft = current + diff * SMOOTH_SCROLL_LERP
  smoothScrollRafId = requestAnimationFrame(smoothScrollStep)
}

function resetSmoothScroll () {
  if (smoothScrollRafId) {
    cancelAnimationFrame(smoothScrollRafId)
    smoothScrollRafId = null
  }

  smoothScrollEl = null
  smoothScrollTarget = 0
}

/**
 * Reverte a manipulação de DOM feita pelo SortableJS.
 * Deve ser chamada ANTES de qualquer atualização reativa do model,
 * para que o Vue parta de um estado DOM consistente ao re-renderizar.
 */
function revertDomDrag (event) {
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
}

/**
 * Adiciona um item na lista de resultados de uma coluna, criando uma nova
 * referência de array para garantir reatividade com markRaw.
 */
function addItemToList ({ headerKey, item, index }) {
  const columnItemList = columnsResultsModel.value[headerKey]
  const updatedList = [...columnItemList]
  const insertIndex = Math.min(index, updatedList.length)

  updatedList.splice(insertIndex, 0, item)

  columnsResultsModel.value[headerKey] = updatedList
  columnsPagination.value[headerKey].count += 1
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
  revertDomDrag(event)

  if (hasConfirmDialogProps.value) closeConfirmDialog()

  stopDragging()
}

function confirmDrop (event) {
  const { from, to, item: { id: itemId } } = event

  const { headerKey: newHeaderKey } = to.dataset
  const { headerKey: oldHeaderKey } = from.dataset

  /**
   * 1. Reverte o DOM imediatamente para que o Vue parta de um estado consistente.
   * O SortableJS já moveu o elemento fisicamente, mas precisamos devolvê-lo
   * antes de atualizar o model reativo.
   */
  revertDomDrag(event)

  /**
   * 2. Atualização otimista: move o item no model ANTES da request de API.
   * Isso garante que a UI esteja sempre sincronizada com o model,
   * eliminando race conditions entre múltiplos drops rápidos.
   */
  const item = getColumnItemById(itemId)

  removeItemFromList({ headerKey: oldHeaderKey, itemId })
  addItemToList({ headerKey: newHeaderKey, item, index: event.newIndex })

  stopDragging()

  /**
   * 3. Marca o item como "em atualização" imediatamente, antes mesmo
   * da request de API iniciar (pode estar na fila).
   */
  updatingPositionItemKeys.value = new Set([...updatingPositionItemKeys.value, itemId])

  /**
   * 4. Enfileira a chamada de API para confirmação no servidor.
   * Se falhar, o model é revertido automaticamente.
   */
  enqueueUpdatePosition({ newHeaderKey, oldHeaderKey, itemId, event, optimisticItem: item })
}

/**
 * Enfileira a chamada de updatePosition para execução sequencial.
 * Garante que a próxima chamada só inicia após a anterior ter finalizado,
 * evitando race conditions no estado compartilhado.
 */
function enqueueUpdatePosition (params) {
  updatePositionQueue = updatePositionQueue.then(
    () => updatePosition(params)
  )
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
   * Cria uma nova referência de array para garantir que o Vue detecte a mudança de estado,
   * mesmo quando o array é marcado com markRaw (que não rastreia mutações in-place).
   */
  const updatedList = [...columnItemList]
  updatedList.splice(itemIndex, 1)

  columnsResultsModel.value[headerKey] = updatedList

  /**
   * Remove o item do count da coluna para não mostrar o botão de "Ver mais¨.
   */
  columnsPagination.value[headerKey].count -= 1
}

function updateItemInList ({ headerKey, itemId, updatedItem }) {
  const columnItemList = columnsResultsModel.value[headerKey]

  const itemIndex = columnItemList.findIndex(itemContent => itemContent[props.itemIdKey] === itemId)

  if (!~itemIndex) return

  columnItemList.splice(itemIndex, 1, updatedItem)
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
async function updatePosition ({ newHeaderKey, oldHeaderKey, itemId, event, optimisticItem }) {
  const params = {
    [props.columnIdKey]: newHeaderKey,
    ...(props.useDragAndDropY && { newIndex: event.newIndex }),
    ...props.updatePositionParams
  }

  const isFnUpdatePositionUrl = typeof props.updatePositionUrl === 'function'

  isLoadingFromSeeMore.value = true

  const url = isFnUpdatePositionUrl
    ? props.updatePositionUrl({ newHeaderKey, oldHeaderKey, itemId })
    : `${props.updatePositionUrl}/${itemId}/update-position`

  const { data, error } = await promiseHandler(
    axios.patch(url, params, {
      adapter: 'fetch',
      fetchOptions: { priority: 'low' }
    }),
    {
      errorMessage: 'Ocorreu um erro ao atualizar a posição de seu item.',
      useLoading: false,
      onLoading: value => {
        isLoadingUpdatePosition.value = value

        columnsLoading.value[newHeaderKey] = value
      }
    }
  )

  const updatedKeys = new Set(updatingPositionItemKeys.value)
  updatedKeys.delete(itemId)
  updatingPositionItemKeys.value = updatedKeys

  if (error) {
    /**
     * Reverte a atualização otimista: move o item de volta da coluna de destino
     * para a coluna de origem no model.
     */
    removeItemFromList({ headerKey: newHeaderKey, itemId })
    addItemToList({ headerKey: oldHeaderKey, item: optimisticItem, index: event.oldIndex })

    emit('update-error', error)

    return
  }

  /**
   * Atualiza o item na coluna de destino com os dados retornados pelo servidor,
   * que podem conter campos atualizados (timestamps, status, etc).
   */
  if (data.data?.result) {
    updateItemInList({ headerKey: newHeaderKey, itemId, updatedItem: data.data.result })
  }

  isUpdatingPosition.value = true

  closeConfirmDialog()

  emit('update-success', data.data)
}

function destroySortable () {
  sortableInstances.value.forEach(sortable => sortable.destroy())
}

/**
 * Cancela a request em andamento de uma coluna específica.
 */
function abortColumnRequest (headerKey) {
  columnAbortControllers[headerKey]?.abort()
  delete columnAbortControllers[headerKey]
}

/**
 * Cancela todas as requests de colunas em andamento.
 * Chamado em onBeforeUnmount e no início de fetchColumnsValues.
 */
function abortAllColumnRequests () {
  /**
   * Invalida a sessão atual de fetchColumns para que, após as requests visíveis
   * serem canceladas, a verificação de sessão impeça o início das requests das
   * colunas ocultas (que ainda não haviam sido disparadas).
   * Sem isso, fetchColumns passaria na verificação e iniciaria as hidden columns
   * mesmo após o componente ter iniciado o processo de unmount.
   */
  currentFetchColumnsSession++

  Object.keys(columnAbortControllers).forEach(key => {
    columnAbortControllers[key]?.abort()
  })

  columnAbortControllers = {}
}

/**
 * Verifica se o erro é resultado de um cancelamento intencional de request
 * (AbortController.abort() via axios ou fetch).
 */
function isCancelledError (error) {
  return error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError'
}

/**
 * Transfere um item de uma coluna para outra localmente, sem realizar nenhuma requisição.
 * O item é sempre inserido como primeiro elemento na coluna de destino.
 * Após a transferência, o SortableJS continua funcionando normalmente sobre os elementos
 * do DOM atualizados pelo Vue, sem necessidade de reinicialização.
 *
 * @param {Object} params
 * @param {string|number} params.itemId - ID do item a ser movido (valor correspondente à prop `itemIdKey`).
 * @param {string|number} params.fromColumnId - ID da coluna de origem (valor correspondente à prop `columnIdKey`).
 * @param {string|number} params.toColumnId - ID da coluna de destino (valor correspondente à prop `columnIdKey`).
 * @param {Object} [params.updatedItem] - Dados atualizados do item. Quando informado, sobrescreve o item original na coluna de destino.
 * @returns {void}
 */
function transferItemToColumn ({ itemId, fromColumnId, toColumnId, updatedItem }) {
  const sourceColumn = columnsResultsModel.value[fromColumnId]
  const itemIndex = sourceColumn?.findIndex(item => item[props.itemIdKey] === itemId)

  if (!sourceColumn || itemIndex === -1) return

  const item = updatedItem ?? sourceColumn[itemIndex]

  removeItemFromList({ headerKey: fromColumnId, itemId })

  columnsResultsModel.value[toColumnId].splice(0, 0, item)
  columnsPagination.value[toColumnId].count += 1
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

  &__ghost {
    border: 1px solid $grey-4 !important;
    overflow: hidden;
    border-radius: $generic-border-radius;
    position: relative;
    margin-bottom: var(--qas-spacing-sm);

    &::after {
      align-items: center;
      background-color: $grey-3;
      border-radius: inherit;
      color: $grey-8;
      content: 'place_item';
      display: flex;
      font-family: 'Material Symbols Rounded';
      font-size: 40px;
      inset: 0;
      justify-content: center;
      position: absolute;
      z-index: 999;
    }
  }
}
</style>
