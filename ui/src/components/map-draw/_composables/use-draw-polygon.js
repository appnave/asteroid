import L from 'leaflet'
import { ref } from 'vue'

/**
 * Composable responsável por todo o fluxo de desenho de novos polígonos no mapa.
 * - Controla o botão de ativar/desativar o desenho.
 * - A linha que vai sendo formada conforme o usuário clica.
 * - A linha que segue o cursor indicando o próximo segmento.
 * - O fechamento do polígono.
 *
 * @param {Object} context
 * @param {() => import('leaflet').Map | null} context.getMap - Getter para a instância do mapa Leaflet
 * @param {Object} context.polygonStyle - Estilo Leaflet aplicado ao polígono finalizado
 * @param {string} context.drawButtonLabel - Texto do tooltip exibido ao passar o mouse sobre o botão de desenho
 * @param {Function} context.onFinishDraw - Callback chamado ao concluir o desenho com { layer, points }
 */
export function useDrawPolygon ({ getMap, polygonStyle, drawButtonLabel, onFinishDraw }) {
  // refs
  const isDrawingActive = ref(false)

  // vars
  /**
   * Estilo Leaflet para as linhas de prévia durante o desenho.
   */
  const PREVIEW_STYLE = { color: '#3388ff', weight: 2, dashArray: '6 4', opacity: 0.9 }

  const drawPoints = {
    preview: [], // Pontos coletados durante o desenho para a camada de preview
    undone: [] // Pontos desfeitos para suporte a redo durante o desenho
  }

  const drawLayer = {
    preview: null, // Linha desenhada no mapa ligando os pontos já clicados
    rubberBand: null // Linha que segue o cursor saindo do último ponto clicado
  }

  let drawButton = null // Botão no canto do mapa que o usuário clica para iniciar/parar o desenho

  // functions
  /**
   * Sincroniza o cursor do mapa para indicar o modo de desenho.
   */
  function syncMapCursor () {
    const map = getMap()

    if (!map) return

    map.getContainer().style.cursor = isDrawingActive.value ? 'crosshair' : ''
  }

  /**
   * Sincroniza o estado visual do botão de desenho.
   */
  function syncDrawButtonState () {
    if (!drawButton) return

    drawButton.style.backgroundColor = isDrawingActive.value ? 'var(--q-primary)' : ''
    drawButton.style.color = isDrawingActive.value ? '#fff' : ''
  }

  /**
   * Remove a camada de prévia do mapa e reseta a referência.
   */
  function clearPreviewLayer () {
    if (!drawLayer.preview) return

    getMap()?.removeLayer(drawLayer.preview)

    drawLayer.preview = null
  }

  /**
   * Remove a camada de rubber band (linha de prévia entre o último ponto e o cursor) do mapa e reseta a referência.
   */
  function clearRubberBand () {
    if (!drawLayer.rubberBand) return

    getMap()?.removeLayer(drawLayer.rubberBand)

    drawLayer.rubberBand = null
  }

  /**
   * Remove a linha de prévia do mapa e descarta os pontos coletados.
   */
  function clearPreview () {
    clearPreviewLayer()
    drawPoints.preview = []
  }

  /**
   * Atualiza ou cria a camada de prévia com os pontos coletados até o momento.
   */
  function updatePreview () {
    clearPreviewLayer()

    /**
     * Precisa de dois pontos para desenhar uma linha de prévia.
     * O primeiro ponto é o início da linha, o segundo é o próximo ponto clicado.
     */
    if (drawPoints.preview.length < 2) return

    drawLayer.preview = L.polyline([...drawPoints.preview], PREVIEW_STYLE).addTo(getMap())
  }

  /**
   * Finaliza o desenho do polígono, criando a camada final e chamando o callback.
   */
  function finishDraw () {
    clearRubberBand()

    // Para formar um polígono válido, são necessários pelo menos 3 pontos.
    if (drawPoints.preview.length >= 3) {
      const map = getMap()

      const layer = L.polygon(drawPoints.preview, polygonStyle).addTo(map)
      const points = drawPoints.preview.map(point => ({ lat: point.lat, lng: point.lng }))

      onFinishDraw({ layer, points })
    }

    isDrawingActive.value = false
    drawPoints.undone = []
    clearPreview()
    syncDrawButtonState()
    syncMapCursor()
  }

  /**
   * Alterna o modo de desenho e atualiza o visual do botão.
   * Ao ativar: reseta pontos e limpa a prévia.
   * Ao desativar: cancela o desenho em andamento.
   */
  function toggleDraw () {
    isDrawingActive.value = !isDrawingActive.value
    syncDrawButtonState()
    syncMapCursor()

    if (isDrawingActive.value) {
      drawPoints.undone = []
      clearPreview()

      return
    }

    cancelDraw()
  }

  /**
   * Cria e adiciona ao mapa o controle personalizado com o botão de desenho.
   * Deve ser chamado após a instância do mapa estar disponível.
   */
  function addDrawControl () {
    const DrawControl = L.Control.extend({
      options: { position: 'topleft' },

      onAdd () {
        const container = L.DomUtil.create('div', 'leaflet-bar app-map__draw-container')

        drawButton = L.DomUtil.create('a', 'app-map__draw-btn', container)
        drawButton.href = '#'
        drawButton.title = drawButtonLabel
        drawButton.setAttribute('role', 'button')
        drawButton.innerHTML = '<i class="q-icon notranslate material-symbols-rounded app-map__location-icon">add_location</i>'

        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.on(drawButton, 'click', L.DomEvent.preventDefault)
        L.DomEvent.on(drawButton, 'click', toggleDraw)

        return container
      }
    })

    new DrawControl().addTo(getMap())
  }

  /**
   * Handler para o evento 'click' do mapa.
   * Registra um ponto ou fecha o polígono se o clique for próximo ao primeiro ponto.
   *
   * @param {L.LeafletMouseEvent} event - Evento de clique do Leaflet contendo a latlng do clique
   */
  function onMapClick (event) {
    if (!isDrawingActive.value) return

    if (drawPoints.preview.length >= 3) {
      const CLOSE_THRESHOLD_PX = 12
      const map = getMap()

      const firstPx = map.latLngToContainerPoint(drawPoints.preview[0])
      const clickPx = map.latLngToContainerPoint(event.latlng)

      // Verifica se o clique está próximo o suficiente do primeiro ponto para fechar o polígono
      const deltaX = firstPx.x - clickPx.x
      const deltaY = firstPx.y - clickPx.y

      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= CLOSE_THRESHOLD_PX) {
        finishDraw()

        return
      }
    }

    drawPoints.preview.push(event.latlng)
    drawPoints.undone = []
    updatePreview()
  }

  /**
   * Handler para o evento 'mousemove' do mapa.
   * Atualiza a linha de rubber band do último ponto confirmado até o cursor.
   *
   * @param {L.LeafletMouseEvent} event - Evento de movimento do mouse do Leaflet contendo a latlng do cursor
   */
  function onMapMouseMove (event) {
    if (!isDrawingActive.value || !drawPoints.preview.length) return

    const map = getMap()

    if (drawLayer.rubberBand) {
      map.removeLayer(drawLayer.rubberBand)
      drawLayer.rubberBand = null
    }

    drawLayer.rubberBand = L.polyline(
      [drawPoints.preview[drawPoints.preview.length - 1], event.latlng],
      PREVIEW_STYLE
    ).addTo(map)
  }

  /**
   * Cancela o desenho em andamento removendo a prévia e o rubber band.
   * Quando chamado externamente (via expose), também atualiza o estado reativo.
   */
  function cancelDraw () {
    if (isDrawingActive.value) {
      isDrawingActive.value = false
      syncDrawButtonState()
      syncMapCursor()
    }

    drawPoints.undone = []
    clearPreview()
    clearRubberBand()
  }

  /**
   * Desfaz o último ponto adicionado durante o desenho.
   */
  function undoDraw () {
    if (!isDrawingActive.value || !drawPoints.preview.length) return

    drawPoints.undone.push(drawPoints.preview.pop())
    updatePreview()
    clearRubberBand()
  }

  /**
   * Refaz o último ponto desfeito durante o desenho.
   */
  function redoDraw () {
    if (!isDrawingActive.value || !drawPoints.undone.length) return

    drawPoints.preview.push(drawPoints.undone.pop())
    updatePreview()
    clearRubberBand()
  }

  /**
   * Limpa os estados e camadas relacionados ao desenho, desativa o modo de desenho e reseta o botão.
   */
  function cleanupDraw () {
    clearPreview()
    clearRubberBand()

    drawPoints.undone = []
    drawButton = null
    isDrawingActive.value = false
  }

  return {
    isDrawingActive,
    addDrawControl,
    onMapClick,
    onMapMouseMove,
    cancelDraw,
    cleanupDraw,
    undoDraw,
    redoDraw
  }
}
