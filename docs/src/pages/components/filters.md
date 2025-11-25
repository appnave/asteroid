---
title: QasFilters
---

Componente para criação de filtros dinâmicos.

<doc-api file="filters/QasFilters" name="QasFilters" />

:::warning
Este componente depende do `Vuex`, utiliza módulos com actions, state e getters para manipular/recuperar os dados. Por exemplo, para você utilizar em uma entidade de listagem de usuários, você **deve** ter um modulo de `users` e dentro de dele ter os seguinte requisitos:
- state: filters.
- getters: filters.
- actions: fetchFilters (que vai popular o state de filters).

Hoje Utilizamos 2 bibliotecas com propósitos diferentes que são compatíveis com o asteroid para lidar com o Vuex, elas são:
[VuexStoreModule](https://github.com/bildvitta/vuex-store-module) e [VuexOffline](https://github.com/bildvitta/vuex-offline).

Para fazer esses exemplos na documentação, estamos utilizando o `VuexOffline`, para saber mais, veja o código fonte da documentação.
:::

:::warning
O componente irá filtrar somente campos com valores que sejam diferente de **null** ou **undefined**, caso contrário ao filtrar o campo irá ser removido da query.
:::

:::tip
Este componente serve para lidar com **filtros dinâmicos**, e normalmente utilizado dentro do `QasListView`.
:::

## Uso
<doc-example file="QasFilters/Basic" title="Básico" />
<doc-example file="QasFilters/OrderBy" title="Com ordenação" />
<doc-example file="QasFilters/ExNoUseSearchOnType" title="Sem pesquisa automática ao digitar" />

Normalmente este componente é utilizando junto ao `QasListView` para filtrar os dados.

<doc-example file="QasFilters/CommonUsage" title="Normalmente utilizado" />

<doc-example file="QasFilters/NoSearch" title="Sem o campo de busca" />

:::warning
Ao utilizar a propriedade `:use-update-route="false"`, a leitura dos filtros assim como a escrita na rota não acontecerá.
:::

<doc-example file="QasFilters/NoRouteUpdate" title="Não realizando a atualização padrão da rota" />

<doc-example file="QasFilters/CustomFilter" title="Usando slot default com funções 'filter' e 'removeFilter'" />

<doc-example file="QasFilters/CustomFilterButton" title="Usando slot filter-button com a função 'filter'" />

:::warning
Utilize a prop `useFullContent` quando precisar adicionar o componente em um grid.
:::
<!-- <doc-example file="QasFilters/WithGrid" title="Usando o qas-filters em um grid" /> -->

#### Filtros com campos lazy loading
Para utilizar campos de select lazy loading (que carregam os dados somente quando o campo é aberto), é necessário que o campo lazy loading siga os requisitos descritos na documentação do [QasSelect](/components/select) (procure pela seção "Lazy Loading") e também que o back-end retorne as opções selecionadas de acordo com a query passada no endpoint GET `:entity/filters`.

No exemplo abaixo, o campo `city` é um campo lazy loading, por padrão quando não houver uma opção selecionada o retorno das opções deverá ser vazio:

**Endpoint**: GET `:entity/filters`

```json
{
  "fields": {
    // ... outros campos
    "city": {
      "name": "city",
      "type": "select",
      "label": "Cidade",
      "useLazyLoading": true,
      "options": [] // Retorna vazio
    }
  }
}
```

Caso uma opção seja selecionada, o retorno deverá ser somente a opção selecionada:

**Endpoint**: GET `:entity/filters?city=cravinhos`

```json
{
  "fields": {
    // ... outros campos
    "city": {
      "name": "city",
      "type": "select",
      "label": "Cidade",
      "useLazyLoading": true,
      "options": [ // Retorna apenas a opção selecionada
        {
          "label": "Cravinhos",
          "value": "cravinhos"
        }
      ]
    }
  }
}
```

O campo `city` do exemplo acima poderia ser múltiplo, então todas as opções selecionadas seriam enviadas separadas por vírgula:

**Endpoint**: GET `:entity/filters?city=cravinhos,jaboticabal`

```json
{
  "fields": {
    // ... outros campos
    "city": {
      "name": "city",
      "type": "select",
      "label": "Cidade",
      "useLazyLoading": true,
      "multiple": true,
      "options": [ // Retorna apenas as opções selecionadas
        {
          "label": "Cravinhos",
          "value": "cravinhos"
        },
        {
          "label": "Jaboticabal",
          "value": "jaboticabal"
        }
      ]
    }
  }
}
```
