import L from 'leaflet'
import { ref } from 'vue'

const EDITING_POLYGON_STYLE = {
  color: '#ff6600',
  fillColor: '#ff6600',
  fillOpacity: 0.2,
  weight: 2.5
}

const VERTEX_MARKER_STYLE = {
  radius: 6,
  color: '#fff',
  fillColor: '#3388ff',
  fillOpacity: 1,
  weight: 2,
  bubblingMouseEvents: false
}

/**
 * Composable responsável por toda a lógica de edição de polígonos no AppMap.
 * Gerencia o estado de edição, marcadores de vértice arrastáveis, arrastar o polígono
 * inteiro e o controle flutuante de Confirmar/Cancelar.
 *
 * @param {Object} context
 * @param {() => import('leaflet').Map | null} context.getMap - Getter para a instância do mapa Leaflet
 * @param {() => Array} context.getPolygons - Getter para o array de polygon entries
 * @param {() => Array} context.getBadgeMarkers - Getter para o array de badge markers
 * @param {import('vue').Ref<boolean>} context.isDrawingActive - Ref do flag de modo de desenho ativo
 * @param {Object} context.polygonStyle - Estilo Leaflet padrão (para restaurar após edição)
 * @param {Function} context.onStartEdit - Callback chamado ao iniciar a edição (ex: fechar tooltip ao editar)
 * @param {Function} context.onConfirm - Callback chamado ao confirmar edição.
 */
export function useEditPolygon (context) {
  const {
    getMap,
    getPolygons,
    getBadgeMarkers,
    isDrawingActive,
    polygonStyle,
    onStartEdit,
    onConfirm
  } = context

  // refs
  const isEditingPolygon = ref(false)

  // vars
  const history = {
    payload: [], // Histórico de snapshots dos pontos para undo/redo
    index: -1 // Índice atual no histórico de edição, -1 significa sem histórico
  }

  let editingPolygonData = null // Dados do polígono atualmente em edição
  let editControl = null // Instância do L.Control flutuante de edição (Confirmar/Cancelar)

  // functions
  /**
   * Muda cursor para 'move' ao passar sobre o layer em edição, indicando que pode ser arrastado
   */
  function onEditLayerMouseover () {
    const map = getMap()

    if (map) map.getContainer().style.cursor = 'move'
  }

  /**
   * Restaura cursor ao sair do layer em edição
   */
  function onEditLayerMouseout () {
    const map = getMap()

    if (map) map.getContainer().style.cursor = ''
  }

  /**
   * Permite arrastar o polígono inteiro mantendo a forma relativa dos vértices
   *
   * @param {L.LeafletMouseEvent} event - Evento de clique do Leaflet contendo a latlng do clique
   */
  function onPolygonDragStart (event) {
    if (!editingPolygonData) return

    const map = getMap()

    L.DomEvent.stop(event)
    map.dragging.disable()
    map.getContainer().style.cursor = 'grabbing'

    const { workingPoints, vertexMarkers, entry } = editingPolygonData
    const startLatLng = event.latlng
    const snapshotPoints = workingPoints.map(point => ({ ...point }))

    // Durante o arrasto, calcula o deslocamento e aplica a todos os pontos e marcadores
    function onMove (moveEvent) {
      const dlat = moveEvent.latlng.lat - startLatLng.lat
      const dlng = moveEvent.latlng.lng - startLatLng.lng

      workingPoints.forEach((point, index) => {
        point.lat = snapshotPoints[index].lat + dlat
        point.lng = snapshotPoints[index].lng + dlng
        vertexMarkers[index].setLatLng([point.lat, point.lng])
      })

      entry.layer.setLatLngs(workingPoints.map(p => [p.lat, p.lng]))
    }

    // Ao soltar o mouse, remove os listeners e restaura o cursor
    function onUp () {
      map.off('mousemove', onMove)
      map.dragging.enable()
      map.getContainer().style.cursor = 'move'
      pushEditSnapshot()
    }

    map.on('mousemove', onMove)
    map.once('mouseup', onUp)
  }

  /**
   * Cria um controle flutuante com botões de Confirmar e Cancelar para finalizar ou cancelar a edição do polígono
   */
  function showEditControl () {
    const EditControl = L.Control.extend({
      options: { position: 'topright' },

      onAdd () {
        /**
         * Criado os botões de Confirmar/Cancelar da edição do polígono.
         * Usado as mesmas classes de estilo utilizado no QasBox e QasBtn.
         */
        const container = L.DomUtil.create('div', 'bg-white qas-box rounded-borders shadow-2 column q-pa-sm q-gutter-y-xs')

        const title = L.DomUtil.create('span', 'text-grey-10 text-h5', container)
        title.textContent = 'Confirmar edição'

        const saveBtn = L.DomUtil.create('button', 'q-btn qas-btn qas-btn--sm qas-btn--primary qas-btn--primary-primary app-map__edit-btn', container)
        saveBtn.textContent = 'Confirmar'

        const cancelBtn = L.DomUtil.create('button', 'q-btn qas-btn qas-btn--sm qas-btn--secondary qas-btn--secondary-primary app-map__edit-btn', container)
        cancelBtn.textContent = 'Cancelar'

        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.on(saveBtn, 'click', finishEditPolygon)
        L.DomEvent.on(cancelBtn, 'click', cancelEditPolygon)

        return container
      }
    })

    editControl = new EditControl().addTo(getMap())
  }

  /**
   * Remove a box de edição flutuante do mapa
   */
  function hideEditControl () {
    if (!editControl) return

    editControl.remove()
    editControl = null
  }

  /**
   * Restaura o estado inicial de edição, limpando histórico, resetando flags e escondendo controles.
   * Deve ser chamado ao finalizar ou cancelar a edição.
   */
  function resetEditState () {
    const map = getMap()

    if (map) map.getContainer().style.cursor = ''

    hideEditControl()
    history.payload = []
    history.index = -1
    editingPolygonData = null
    isEditingPolygon.value = false
  }

  /**
   * Registra um snapshot dos pontos atuais no histórico de edição para undo/redo.
   */
  function pushEditSnapshot () {
    if (!editingPolygonData) return

    // Descarta snapshots à frente do índice atual para que Ctrl+Y não refaça ações antigas após uma nova edição.
    history.payload = history.payload.slice(0, history.index + 1)
    history.payload.push(editingPolygonData.workingPoints.map(point => ({ ...point })))
    history.index++
  }

  /**
   * Restaura os pontos do polígono que estou editando para um snapshot específico do histórico,
   * atualizando os marcadores e o layer. Usado para undo/redo.
   *
   * @param {Array<Object>} points - Array de pontos { lat, lng } para restaurar no polígono em edição.
   */
  function restoreEditSnapshot (points) {
    if (!editingPolygonData) return

    const { entry, vertexMarkers, workingPoints } = editingPolygonData

    // Atualiza os pontos do polígono, marcadores e layer para refletir o snapshot restaurado
    workingPoints.splice(0, workingPoints.length, ...points.map(point => ({ ...point })))
    vertexMarkers.forEach((marker, index) => marker.setLatLng([workingPoints[index].lat, workingPoints[index].lng]))
    entry.layer.setLatLngs(workingPoints.map(p => [p.lat, p.lng]))
  }

  /**
   * Desfaz a última ação de edição do polígono.
   */
  function undoEdit () {
    if (!editingPolygonData || history.index <= 0) return

    history.index--
    restoreEditSnapshot(history.payload[history.index])
  }

  /**
   * Refaz a última ação desfeita na edição do polígono.
   */
  function redoEdit () {
    if (!editingPolygonData || history.index >= history.payload.length - 1) return

    history.index++
    restoreEditSnapshot(history.payload[history.index])
  }

  /**
   * Ativa o modo de edição para o polygon entry com a key informada.
   * Exibe marcadores de vértice arrastáveis e habilita arrastar o polígono inteiro.
   *
   * @param {number} key - key do polygon entry gerada em renderPolygonsFromModel
   */
  function startEditPolygon (key) {
    const map = getMap()

    // Não inicia a edição se o mapa não estiver disponível ou se já estiver em modo de desenho.
    if (!map || isDrawingActive.value) return

    // Se já estiver editando outro polígono, finaliza a edição atual antes de iniciar a nova
    if (editingPolygonData) finishEditPolygon()

    // Encontra o entry correspondente à key. Se não encontrar, aborta a edição.
    const entry = getPolygons().find(point => point.key === key)

    if (!entry) return

    onStartEdit()

    /**
     * Cria cópias dos pontos originais para manipulação durante a edição,
     * mantendo os originais intactos para possível cancelamento.
     */
    const originalPoints = entry.points.map(point => ({ ...point }))
    const workingPoints = entry.points.map(point => ({ ...point }))

    editingPolygonData = { modelItem: entry.modelItem, entry, vertexMarkers: [], workingPoints, originalPoints }

    // Inicializa o histórico de edição com o estado atual do polígono.
    history.payload = [workingPoints.map(point => ({ ...point }))]
    history.index = 0

    entry.layer.setStyle(EDITING_POLYGON_STYLE)

    /**
     * Cria marcadores de vértice arrastáveis para cada ponto do polígono.
     */
    workingPoints.forEach((point, index) => {
      const marker = L.circleMarker([point.lat, point.lng], VERTEX_MARKER_STYLE).addTo(map)

      marker.on('mouseover', () => { map.getContainer().style.cursor = 'grab' })
      marker.on('mouseout', () => { map.getContainer().style.cursor = '' })

      marker.on('mousedown', event => {
        L.DomEvent.stop(event)
        map.dragging.disable()
        map.getContainer().style.cursor = 'grabbing'

        function onMove (moveEvent) {
          workingPoints[index] = { lat: moveEvent.latlng.lat, lng: moveEvent.latlng.lng }
          marker.setLatLng([moveEvent.latlng.lat, moveEvent.latlng.lng])
          entry.layer.setLatLngs(workingPoints.map(p => [p.lat, p.lng]))
        }

        function onUp () {
          map.off('mousemove', onMove)
          map.dragging.enable()
          map.getContainer().style.cursor = ''
          pushEditSnapshot()
        }

        map.on('mousemove', onMove)
        map.once('mouseup', onUp)
      })

      editingPolygonData.vertexMarkers.push(marker)
    })

    /**
     * Adiciona eventos ao layer do polígono para permitir arrastar e alterar o cursor ao passar o mouse.
     */
    entry.layer.on('mousedown', onPolygonDragStart)
    entry.layer.on('mouseover', onEditLayerMouseover)
    entry.layer.on('mouseout', onEditLayerMouseout)

    showEditControl()
    isEditingPolygon.value = true
  }

  /**
   * Confirma a edição: salva os pontos finais no entry, reposiciona a badge e chama onConfirm.
   */
  function finishEditPolygon () {
    if (!editingPolygonData) return

    const map = getMap()
    const { modelItem, entry, vertexMarkers, workingPoints } = editingPolygonData

    vertexMarkers.forEach(marker => map.removeLayer(marker))

    // Remove os listeners de arrastar do layer para evitar conflitos com futuras edições
    entry.layer.off('mousedown', onPolygonDragStart)
    entry.layer.off('mouseover', onEditLayerMouseover)
    entry.layer.off('mouseout', onEditLayerMouseout)

    entry.layer.setStyle(entry.style || polygonStyle)
    entry.points = workingPoints.map(point => ({ ...point }))

    // reposiciona a badge para o novo centro do polígono
    const polygons = getPolygons()
    const badgeMarkers = getBadgeMarkers()
    const polygonIndex = polygons.indexOf(entry)

    // Se o polígono editado tiver uma badge associada, reposiciona a badge para o centro do novo polígono
    if (polygonIndex >= 0 && badgeMarkers[polygonIndex]) {
      const lat = entry.points.reduce((sum, point) => sum + point.lat, 0) / entry.points.length
      const lng = entry.points.reduce((sum, point) => sum + point.lng, 0) / entry.points.length

      badgeMarkers[polygonIndex].setLatLng([lat, lng])
    }

    /**
     * Chama a função de callback onConfirm com os dados do polígono editado.
     */
    onConfirm({ modelItem, entry })

    resetEditState()
  }

  /**
   * Cancela a edição: restaura posição e estilo originais sem alterar o v-model.
   */
  function cancelEditPolygon () {
    const map = getMap()

    if (!editingPolygonData || !map) return

    const { entry, vertexMarkers, originalPoints } = editingPolygonData

    vertexMarkers.forEach(marker => map.removeLayer(marker))

    // Remove os listeners de arrastar do layer para evitar conflitos com futuras edições
    entry.layer.off('mousedown', onPolygonDragStart)
    entry.layer.off('mouseover', onEditLayerMouseover)
    entry.layer.off('mouseout', onEditLayerMouseout)

    // Restaura os pontos originais e o estilo do polígono
    entry.layer.setLatLngs(originalPoints.map(point => [point.lat, point.lng]))
    entry.layer.setStyle(entry.style || polygonStyle)
    entry.points = originalPoints

    resetEditState()
  }

  /**
   * Limpa o estado interno — deve ser chamado no onBeforeUnmount do componente pai.
   */
  function cleanupEditPolygon () {
    history.payload = []
    history.index = -1
    editingPolygonData = null
    editControl = null
  }

  return {
    isEditingPolygon,
    startEditPolygon,
    finishEditPolygon,
    cancelEditPolygon,
    cleanupEditPolygon,
    undoEdit,
    redoEdit
  }
}
