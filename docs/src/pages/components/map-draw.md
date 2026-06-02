---
title: QasMapDraw
---

Componente de mapa interativo baseado em [Leaflet](https://leafletjs.com/) para desenho e edição de polígonos sobre uma imagem de fundo (ex. planta baixa de um empreendimento).

<doc-api file="map-draw/QasMapDraw" name="QasMapDraw" />

:::tip
Este componente requer `leaflet` como peerDependency. Instale com:
```bash
npm install leaflet
```
:::

:::tip
- O mapa usa `CRS.Simple` — grade 2D cartesiana sem projeção geográfica, ideal para plantas baixas.
- **Ctrl+Z** desfaz o último ponto durante o desenho ou a última alteração durante a edição.
- **Ctrl+Y** refaz a última ação desfeita.
:::

## Uso

<doc-example file="QasMapDraw/Basic" title="Básico" />

<doc-example file="QasMapDraw/WithTooltip" title="Com tooltip de polígono" />

:::info
##### Editar polígono

Para iniciar a edição de um polígono existente, use o método exposto `startEditPolygon(key)`, passando o `polygon-key` recebido no slot `polygon-tooltip`.

```js
const mapRef = ref(null)

function onEdit (polygonKey) {
  mapRef.value.startEditPolygon(polygonKey)
}
```
:::

:::info
##### Substituir imagem

Para trocar a imagem de fundo mantendo os polígonos existentes, use o método `replaceImage(newUrl)`.

```js
mapRef.value.replaceImage('https://exemplo.com/nova-planta.jpg')
```
:::
