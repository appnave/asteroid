<template>
  <div
    ref="mapContainer"
    class="app-map"
  >
    <div
      v-if="hoveredItem"
      class="app-map__polygon-tooltip"
      :style="hoveredItemStyle"
      @mouseenter="cleanupTooltip"
      @mouseleave="scheduleHideTooltip"
    >
      <slot
        :item="hoveredItem"
        name="polygon-tooltip"
        :polygon-key="hoveredPolygonKey"
      />
    </div>

    <q-inner-loading :showing="isLoading">
      <q-spinner
        color="primary"
        size="40px"
      />
    </q-inner-loading>

    <qas-alert
      v-if="hasAlert"
      class="app-map__alert"
      text="Use Ctrl + Z para desfazer e Ctrl + Y para refazer alterações."
      use-box
    />
  </div>
</template>

<script setup>
import { useEditPolygon } from './_composables/use-edit-polygon.js'
import { useDrawPolygon } from './_composables/use-draw-polygon.js'
import { usePolygonTooltip } from './_composables/use-polygon-tooltip.js'
import { usePolygons } from './_composables/use-polygons.js'

import { ref, watch, onMounted, onBeforeUnmount, computed, useTemplateRef } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

defineOptions({ name: 'QasMapDraw' })

const props = defineProps({
  // URL da imagem usada como fundo do mapa (planta do empreendimento)
  imageUrl: {
    type: String,
    default: ''
  },

  height: {
    type: String,
    default: '600px'
  },

  modelKey: {
    type: String,
    default: 'points'
  },

  // Irá ter o comportamento de ao finalizar as marcações, irá ser adicionado no model com base no modelKey
  useHandleModel: {
    type: Boolean,
    default: true
  },

  // Chave do item do model que será exibida no badge de cada polígono (opcional)
  badgeLabelKey: {
    type: String,
    default: ''
  },

  // Callback opcional (item) => string para retornar classes CSS de cor aplicadas à badge e ao polígono
  getItemClasses: {
    type: Function,
    default: undefined
  },

  // Texto exibido no tooltip do botão de desenho
  drawButtonLabel: {
    type: String,
    default: ''
  },

  useDrawButton: {
    type: Boolean,
    default: true
  }
})

// models
const model = defineModel({ type: Array, default: () => [] })

// emits
const emit = defineEmits(['area-drawn', 'polygon-edited'])

// refs
const mapContainerRef = useTemplateRef('mapContainer')
const isLoading = ref(true)

// consts
/**
 * estado compartilhado entre composables — acessado via getters (closures)
 */
let map = null
let imageOverlay = null
const polygons = []
const badgeMarkers = []
let suppressModelWatch = false

/**
 * Estilos Leaflet reutilizados pelos composables
 */
const POLYGON_STYLE = { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.25, weight: 2 }

// composables
/**
 * Tooltip exibido ao passar o mouse sobre um polígono.
 */
const {
  hoveredItem,
  hoveredPolygonKey,
  hoveredItemStyle,
  showTooltip,
  updateTooltipPosition,
  scheduleHideTooltip,
  hideTooltip,
  cleanupTooltip
} = usePolygonTooltip()

/**
 * Fluxo de desenho de novos polígonos por clique.
 */
const {
  isDrawingActive,
  addDrawControl,
  onMapClick,
  onMapMouseMove,
  cancelDraw,
  cleanupDraw,
  undoDraw,
  redoDraw
} = useDrawPolygon({
  getMap,
  polygonStyle: POLYGON_STYLE,
  drawButtonLabel: props.drawButtonLabel,
  onFinishDraw: handleFinishDraw
})

/**
 * Edição de polígonos existentes (arrastar vértices e polígono inteiro).
 */
const {
  isEditingPolygon,
  startEditPolygon,
  cancelEditPolygon,
  cleanupEditPolygon,
  undoEdit,
  redoEdit
} = useEditPolygon({
  getMap,
  getPolygons,
  getBadgeMarkers,
  isDrawingActive,
  polygonStyle: POLYGON_STYLE,
  onStartEdit: hideTooltip,
  onConfirm: handlePolygonEditConfirm
})

/**
 * Renderização/sincronização dos polígonos com o v-model e gerenciamento de badges.
 */
const {
  addBadge,
  registerPolygon,
  removeLastPolygon,
  removePolygon,
  renderPolygonsFromModel
} = usePolygons({
  getMap,
  getPolygons,
  getBadgeMarkers,
  polygonStyle: POLYGON_STYLE,
  modelKey: props.modelKey,
  badgeLabelKey: props.badgeLabelKey,
  getItemClasses: props.getItemClasses,
  cancelEditPolygon,
  onReset: hideTooltip,
  onMouseover: handlePolygonMouseover,
  onMousemove: handlePolygonMousemove,
  onMouseout: scheduleHideTooltip,
  onRemoveLastPolygon: handleRemoveLastPolygon,
  model
})

// exposes
defineExpose({
  addBadge,
  cancelDraw,
  removeLastPolygon,
  removePolygon,
  replaceImage,
  startEditPolygon
})

// hooks
/**
 * Detecta mudanças externas no v-model e re-renderiza o mapa.
 * suppressModelWatch evita loop quando a mudança parte do próprio componente.
 */
watch(() => model.value, onUpdateModelValue, { deep: true })

onMounted(setupMap)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)

  cleanupTooltip()
  cleanupDraw()
  cleanupEditPolygon()

  if (!map) return

  map.remove()
  map = null
})

// computeds
const hasAlert = computed(() => isDrawingActive.value || isEditingPolygon.value)

// functions
/**
 * Callback chamado ao finalizar o desenho de um polígono, para adicionar ao mapa e opcionalmente ao model.
 * @param {Object} params
 * @param {import('leaflet').Polygon} params.layer - Layer do polígono desenhado
 * @param {Array} params.points - Pontos do polígono desenhado
 */
function handleFinishDraw ({ layer, points }) {
  const modelItem = { [props.modelKey]: points }

  registerPolygon({ layer, points, modelItem })

  /**
   * Se useHandleModel for true, adiciona os pontos do novo polígono ao model usando a modelKey,
   * para sincronizar externamente.
   */
  if (props.useHandleModel) {
    suppressModelWatch = true

    model.value = [...model.value, modelItem]
  }

  // Emite os pontos que foram desenhados ao finalizar o polígono.
  emit('area-drawn', points)
}

/**
 * Função chamada ao confirmar a edição de um polígono.
 * @param {Object} params
 * @param {Object} params.modelItem - Item original do v-model que está sendo editado
 * @param {Object} params.entry - Entrada do polígono editado contendo os novos pontos
 */
function handlePolygonEditConfirm ({ modelItem, entry }) {
  suppressModelWatch = true

  // Atualiza os pontos do polígono editado no model, usando a modelKey para localizar o polígono que será atualizado.
  model.value = model.value.map(item => {
    return item === modelItem ? { ...item, [props.modelKey]: entry.points } : item
  })
}

/**
 * Exibe a tooltip ao passar o mouse sobre um polígono, a menos que esteja desenhando ou editando.
 *
 * @param {Object} modelItem - Item do modelo associado ao polígono
 * @param {string} polygonKey - Chave do polígono
 * @param {Object} containerPoint - Ponto no container do mapa
 */
function handlePolygonMouseover (modelItem, polygonKey, containerPoint) {
  if (isDrawingActive.value || isEditingPolygon.value) return

  showTooltip({ item: modelItem, polygonKey, containerPoint })
}

/**
 * Atualiza a posição da tooltip ao mover o mouse dentro do polígono, para acompanhar o cursor.
 * @param {Object} containerPoint - Ponto no container do mapa
 */
function handlePolygonMousemove (containerPoint) {
  if (!hoveredItem.value) return

  updateTooltipPosition(containerPoint)
}

/**
 * Função para substituir a imagem de fundo do mapa, mantendo os polígonos e badges atuais.
 * Carrega a nova imagem para obter as dimensões reais e atualiza os bounds do overlay,
 * garantindo que o sistema de coordenadas fique consistente com o próximo carregamento da página.
 *
 * @param {string} newUrl - URL da nova imagem a ser usada como fundo do mapa.
 */
function replaceImage (newUrl) {
  const img = new Image()

  img.onload = function () {
    const bounds = [[0, 0], [img.naturalHeight, img.naturalWidth]]

    // Atualiza o overlay da imagem com a nova URL e os novos bounds baseados nas dimensões reais da imagem.
    imageOverlay.setBounds(L.latLngBounds(bounds))
    imageOverlay.setUrl(newUrl)

    map.fitBounds(bounds)
    map.setZoom(map.getZoom() + 1)
  }

  // Se a nova imagem falhar ao carregar, mantém a imagem atual e evita quebrar o mapa.
  img.onerror = function () {
    imageOverlay.setUrl(newUrl)
  }

  img.src = newUrl
}

/**
 * Função chamada ao remover o último polígono desenhado, para re-renderizar os polígonos restantes a partir do model.
 */
function handleRemoveLastPolygon () {
  suppressModelWatch = true
  model.value = polygons.map(polygon => [...polygon.points])
}

/**
 * Inicializa o mapa Leaflet sobre a imagem de fundo.
 * Usa CRS.Simple — grade 2D cartesiana, sem projeção geográfica — ideal para plantas baixas.
 *
 * @param {number} width  - largura real da imagem em pixels
 * @param {number} height - altura real da imagem em pixels
 */
function setupLeaflet (width, height) {
  map = L.map(mapContainerRef.value, {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 3,
    zoomControl: false,
    doubleClickZoom: false,
    attributionControl: false
  })

  const zoomControl = L.control.zoom({ zoomInTitle: 'Mais zoom', zoomOutTitle: 'Menos zoom' }).addTo(map)
  const zoomContainer = zoomControl.getContainer()
  zoomContainer.querySelector('.leaflet-control-zoom-in').innerHTML = '<i class="q-icon notranslate material-symbols-rounded app-map__location-icon">zoom_in</i>'
  zoomContainer.querySelector('.leaflet-control-zoom-out').innerHTML = '<i class="q-icon notranslate material-symbols-rounded app-map__location-icon">zoom_out</i>'

  const bounds = [[0, 0], [height, width]]

  imageOverlay = L.imageOverlay(props.imageUrl, bounds).addTo(map)
  map.fitBounds(bounds)
  map.setZoom(map.getZoom() + 1)

  /**
   * Se useDrawButton for true, adiciona o controle de desenho ao mapa para
   * permitir que os usuários desenhem novos polígonos.
   */
  if (props.useDrawButton) addDrawControl()

  map.on('click', onMapClick)
  map.on('mousemove', onMapMouseMove)

  if (model.value?.length) renderPolygonsFromModel(model.value)
}

/**
 * Função que retorna a instância do mapa Leaflet para os composables
 */
function getMap () {
  return map
}

/**
 * Função que retorna os polígonos renderizados no mapa
 */
function getPolygons () {
  return polygons
}

/**
 * Função que retorna os badges renderizados no mapa
 */
function getBadgeMarkers () {
  return badgeMarkers
}

/**
 * Atalhos de teclado Ctrl+Z (desfazer) e Ctrl+Y (refazer) durante desenho ou edição.
 *
 * @param event - Evento de teclado
 */
function handleKeydown (event) {
  if (!event.ctrlKey) return

  const actions = {
    z: { draw: undoDraw, edit: undoEdit },
    y: { draw: redoDraw, edit: redoEdit }
  }

  const action = actions[event.key]

  if (!action) return

  event.preventDefault()

  /**
   * Durante o desenho, Ctrl+Z desfaz o último ponto adicionado e Ctrl+Y refaz. Durante a edição,
   * desfaz/refaz a última alteração nos vértices ou posição do polígono.
   */
  if (isDrawingActive.value) action.draw()

  if (isEditingPolygon.value) action.edit()
}

/**
 * Função chamada quando o valor do model é atualizado.
 * Atualiza os polígonos no mapa com base no novo valor do model.
 *
 * @param {Array<Object>} newValue - Novo valor do model
 */
function onUpdateModelValue (newValue) {
  if (suppressModelWatch) {
    suppressModelWatch = false
    return
  }

  if (!map) return

  renderPolygonsFromModel(newValue)
}

function setupMap () {
  mapContainerRef.value.style.height = props.height

  const img = new Image()

  // aguarda a imagem carregar para obter dimensões reais e configurar o mapa corretamente.
  img.onload = () => {
    setupLeaflet(img.naturalWidth, img.naturalHeight)
    isLoading.value = false
  }

  img.onerror = () => {
    setupLeaflet(1920, 1080)
    isLoading.value = false
  }

  img.src = props.imageUrl

  window.addEventListener('keydown', handleKeydown)
}
</script>

<style lang="scss">
.app-map {
  width: 100%;
  background-color: $grey-4;
  position: relative;

  &.leaflet-container {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  &__polygon-tooltip {
    position: absolute;
    z-index: 1200;
  }

  .leaflet-control {
    border: none !important;
    background: #FFF;
  }

  .leaflet-control-zoom-in {
    border-bottom-left-radius: unset !important;
    border-bottom-right-radius: unset !important;
  }

  .leaflet-left a {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  &__draw-container {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__draw-btn {
    cursor: pointer;
    transition: background-color var(--qas-generic-transition);
    width: 35px !important;
    height: 35px !important;
  }

  &__edit-btn {
    border-radius: $button-border-radius !important;
  }

  &__alert {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 1200;
  }
}
</style>
