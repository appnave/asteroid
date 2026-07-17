import L from 'leaflet'
import { colors } from 'quasar'

/**
 * Composable responsável por renderizar e gerenciar os polígonos vinculados no mapa.
 * Cuida da sincronização com o v-model, das badges e dos eventos de mouse por polígono.
 *
 * @param {Object} context
 * @param {() => import('leaflet').Map | null} context.getMap - Getter para a instância do mapa Leaflet
 * @param {() => Array} context.getPolygons - Getter para o array de polygon entries
 * @param {() => Array} context.getBadgeMarkers - Getter para o array de badge markers
 * @param {Object} context.polygonStyle - Estilo Leaflet padrão dos polígonos
 * @param {string} context.modelKey - Chave usada para ler os pontos em cada item do model
 * @param {string} context.badgeLabelKey - Caminho para o label da badge
 * @param {Function} [context.itemColorFn] - Callback opcional que retorna um nome de cor Quasar (ex: 'yellow-4')
 * @param {Function} context.cancelEditPolygon - Cancela qualquer edição ativa antes de re-renderizar
 * @param {Function} context.onReset - Callback chamado ao iniciar re-renderização (ex: fechar tooltip)
 * @param {Function} context.onMouseover - Callback(modelItem, polygonKey, containerPoint) ao entrar no polígono
 * @param {Function} context.onMousemove - Callback(containerPoint) ao mover o mouse sobre o polígono
 * @param {Function} context.onMouseout - Callback ao sair do polígono
 * @param {Function} context.onRemoveLastPolygon - Callback chamado após remover o último polígono (para atualizar o model)
 * @param {import('vue').Ref<Array>} context.model - Ref reativa do v-model, atualizada diretamente ao remover um polígono
 */
export function usePolygons (context) {
  const {
    getMap,
    getPolygons,
    getBadgeMarkers,
    polygonStyle,
    modelKey,
    badgeLabelKey,
    itemColorFn,
    cancelEditPolygon,
    onReset,
    onMouseover,
    onMousemove,
    onMouseout,
    onRemoveLastPolygon,
    model
  } = context

  // vars
  let polygonKeyIndex = 0

  // functions
  /**
   * Resolve um nome de cor Quasar (ex: 'yellow-4') ou hex/rgb para um hex usável inline.
   * @param {string} colorName - nome da cor
   */
  function resolveColor (colorName) {
    if (!colorName) return ''

    return colors.getPaletteColor(colorName) || ''
  }

  /**
   * Adiciona uma badge no centro do polígono.
   *
   * @param {Array<Object>} points - array de pontos { lat, lng }
   * @param {string} label - texto exibido dentro da badge
   * @param {string} [itemColor] - cor hex resolvida para colorir a badge inline
   */
  function addBadge (points, label = '', itemColor = '') {
    const map = getMap()

    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length

    const defaultStyle = 'height: 20px; transform: translate(-50%,-50%);'
    let formattedBadgeColor = ''

    // Caso foi passado uma cor para o item, resolve a cor de fundo e do texto da badge para garantir legibilidade.
    if (itemColor) {
      /**
       * faz o tratamento pra definir a cor do texto da badge com base na luminosidade da cor de fundo,
       * garantindo legibilidade.
       */
      const color = colors.brightness(itemColor) > 128 ? '#000' : '#fff'

      formattedBadgeColor = `background-color:${itemColor}; color:${color};`
    }

    const badgeHtml = `<div class="q-badge flex inline items-center no-wrap q-badge--single-line qas-badge" style="${formattedBadgeColor}${defaultStyle}">${label}</div>`

    const badge = L.divIcon({
      className: '',
      html: badgeHtml,
      iconSize: null,
      iconAnchor: [0, 0]
    })

    getBadgeMarkers().push(L.marker(L.latLng(lat, lng), { icon: badge, interactive: false }).addTo(map))
  }

  /**
   * Registra os listeners de mouse em um layer de polígono já adicionado ao mapa.
   *
   * Os eventos do Leaflet expõem coordenadas geográficas (`latlng`), mas os callbacks
   * externos (`onMouseover`, `onMousemove`) recebem coordenadas de tela em pixels
   * (`containerPoint`). A conversão acontece aqui para que o componente que forneceu
   * os callbacks não precise conhecer a API do Leaflet.
   *
   * @param {Object} context - Contexto contendo as informações do polígono
   * @param {import('leaflet').Polygon} context.layer - Layer do polígono ao qual os eventos serão vinculados
   * @param {Object} context.modelItem - Item original do v-model que originou este polígono
   * @param {number} context.polygonKey - Chave única do polígono dentro do composable
   */
  function handleMouseEvents (context) {
    const { layer, modelItem, polygonKey } = context

    const map = getMap()

    layer.on('mouseover', event => {
      onMouseover(modelItem, polygonKey, map.latLngToContainerPoint(event.latlng))
    })

    layer.on('mousemove', event => {
      onMousemove(map.latLngToContainerPoint(event.latlng))
    })

    layer.on('mouseout', onMouseout)
  }

  /**
   * Remove o último polígono finalizado do mapa.
   * Deve ser chamado quando o usuário cancela o vínculo após o desenho.
   */
  function removeLastPolygon () {
    const polygons = getPolygons()

    if (!polygons.length) return

    getMap().removeLayer(polygons.pop().layer)
    onRemoveLastPolygon()
  }

  /**
   * Remove um polígono específico do mapa pelo seu key.
   * Remove também a badge correspondente e atualiza o model.
   *
   * @param {number} polygonKey - Key único do polígono (mesmo valor recebido nos callbacks de mouse)
   */
  function removePolygon (polygonKey) {
    const polygons = getPolygons()
    const badgeMarkers = getBadgeMarkers()
    const map = getMap()

    const index = polygons.findIndex(entry => entry.key === polygonKey)

    if (index === -1) return

    // Remove o layer do polígono do mapa e do array de polígonos
    const [removed] = polygons.splice(index, 1)
    map.removeLayer(removed.layer)

    // Remove a badge correspondente
    const badge = badgeMarkers.splice(index, 1)?.[0]

    if (badge) map.removeLayer(badge)

    // Atualiza o model filtrando o item removido
    model.value = model.value.filter(item => item !== removed.modelItem)
  }

  /**
   * Registra um polígono recém-criado, adicionando-o ao array reativo e vinculando os eventos de mouse.
   *
   * @param {Object} context
   * @param {import('leaflet').Polygon} context.layer - Layer do polígono já adicionado ao mapa
   * @param {Array<Object>} context.points - array de pontos { lat, lng } usados para criar o polígono
   * @param {Object} context.modelItem - item original do v-model que originou este polígono
   */
  function registerPolygon ({ layer, points, modelItem }) {
    const entry = { layer, points, modelItem, key: polygonKeyIndex++ }

    getPolygons().push(entry)
    handleMouseEvents({ layer, modelItem, polygonKey: entry.key })

    return entry
  }

  /**
   * Limpa todos os polígonos e badges do mapa e re-renderiza a partir da lista fornecida.
   * Cancela qualquer edição ativa antes de iniciar.
   *
   * @param {Array<Object>} polygonList - itens do v-model, cada um com a propriedade [modelKey] contendo os pontos
   */
  function renderPolygonsFromModel (polygonList = []) {
    // Cancela qualquer edição ativa para evitar estado inconsistente durante a re-renderização
    cancelEditPolygon()

    // Notifica o componente pai para fechar tooltip ou qualquer UI aberta
    onReset()

    const map = getMap()
    const polygons = getPolygons()
    const badgeMarkers = getBadgeMarkers()

    // Remove os layers de polígonos e badges existentes do mapa antes de re-renderizar
    polygons.forEach(({ layer }) => map.removeLayer(layer))
    badgeMarkers.forEach(marker => map.removeLayer(marker))

    // Limpa os arrays reativos após remover do mapa
    polygons.length = 0
    badgeMarkers.length = 0

    polygonList.forEach(polygon => {
      // Lê os pontos do item usando a chave configurada pelo consumidor (ex: 'coordinates')
      const points = polygon[modelKey]

      // Ignora itens sem pontos para não criar polígonos inválidos
      if (!points?.length) return

      // Resolve a cor personalizada do item se o callback itemColorFn foi fornecido
      const resolvedColor = itemColorFn ? resolveColor(itemColorFn(polygon)) : ''

      // Aplica a cor personalizada ao estilo do layer, sobrescrevendo fillColor e color do padrão
      const layerStyle = resolvedColor
        ? { ...polygonStyle, fillColor: resolvedColor, color: resolvedColor, fillOpacity: 0.35 }
        : polygonStyle

      // Cria e adiciona o layer do polígono ao mapa
      const layer = L.polygon(points, layerStyle).addTo(map)

      // Monta o entry com todos os dados necessários para edição, eventos e badge
      const entry = { layer, points, modelItem: polygon, key: polygonKeyIndex++, style: layerStyle }

      // Registra o entry no array reativo para rastreamento interno
      polygons.push(entry)

      // Vincula os eventos de mouseover/mousemove/mouseout ao layer
      handleMouseEvents({ layer, modelItem: polygon, polygonKey: entry.key })

      // Adiciona a badge com label e cor no centro do polígono
      addBadge(points, polygon[badgeLabelKey], resolvedColor)
    })
  }

  return {
    addBadge,
    registerPolygon,
    removeLastPolygon,
    removePolygon,
    renderPolygonsFromModel
  }
}
