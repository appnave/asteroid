import { ref, computed } from 'vue'

/**
 * Composable responsável pelo estado reativo do tooltip de polígonos.
 * Sem dependência do Leaflet — gerencia apenas reatividade Vue e o timer de fechamento.
 */
export function usePolygonTooltip () {
  // refs
  const hoveredItem = ref(null)
  const hoveredPolygonKey = ref(null)
  const tooltipPosition = ref({ x: 0, y: 0 })

  // lets
  let hideTooltipTimeout = null

  // computeds
  const hoveredItemStyle = computed(() => {
    return {
      left: `${tooltipPosition.value.x}px`,
      top: `${tooltipPosition.value.y}px`
    }
  })

  // functions
  /**
   * Exibe o tooltip para o item informado na posição containerPoint.
   * Cancela qualquer timeout de fechamento pendente.
   *
   * @param {Object} params
   * @param {Object} params.item - Dados do item a ser exibido no tooltip
   * @param {string} params.polygonKey - Chave do polígono para o qual o item pertence
   * @param {{ x: number, y: number }} params.containerPoint - Posição em pixels relativa ao container do mapa
   * para posicionar o tooltip
   */
  function showTooltip (params) {
    const { item, polygonKey, containerPoint } = params

    clearTimeout(hideTooltipTimeout)

    hoveredItem.value = item
    hoveredPolygonKey.value = polygonKey

    updateTooltipPosition(containerPoint)
  }

  /**
   * Atualiza a posição do tooltip com offset padrão em relação ao cursor.
   *
   * @param {{ x: number, y: number }} containerPoint - posição em pixels relativa ao container do mapa
   */
  function updateTooltipPosition (containerPoint) {
    const TOOLTIP_OFFSET = { x: 15, y: -10 }

    tooltipPosition.value = { x: containerPoint.x + TOOLTIP_OFFSET.x, y: containerPoint.y + TOOLTIP_OFFSET.y }
  }

  /**
   * Agenda o fechamento do tooltip com um pequeno delay para permitir que o mouse se mova até ele.
   */
  function scheduleHideTooltip () {
    hideTooltipTimeout = setTimeout(() => {
      hoveredItem.value = null
      hoveredPolygonKey.value = null
    }, 150)
  }

  /**
   * Fecha o tooltip imediatamente, cancelando qualquer timeout pendente.
   */
  function hideTooltip () {
    cleanupTooltip()

    hoveredItem.value = null
    hoveredPolygonKey.value = null
  }

  /**
   * Cancela o timeout (usado quando o mouse entra no próprio tooltip).
   */
  function cleanupTooltip () {
    clearTimeout(hideTooltipTimeout)
  }

  return {
    hoveredItem,
    hoveredPolygonKey,
    hoveredItemStyle,
    showTooltip,
    updateTooltipPosition,
    scheduleHideTooltip,
    hideTooltip,
    cleanupTooltip
  }
}
