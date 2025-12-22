---
title: QasMap
---

Componente para utilizar mapa do Google.

:::warning
##### Instalação

Este componente necessita da biblioteca `'@fawmi/vue-google-maps': '^0.9.79'` instalada no projeto, instale manualmente.

###### Configuração

```bash
npm i @fawmi/vue-google-maps@0.9.79
```

```js
// package.json
{
  "dependencies": {
    "@fawmi/vue-google-maps": "^0.9.79"
  }
}

// quasar.config.js
{
  build: {
    env: {
      MAPS_API_KEY: 'SUA_API_KEY_DO_GOOGLE'
    }
  }
}
```
:::

<doc-api file="map/QasMap" name="QasMap" />

## Uso

<doc-example file="QasMap/Basic" title="Básico" />
