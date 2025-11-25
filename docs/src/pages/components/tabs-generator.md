---
title: QasTabsGenerator
---

Componente wrapper do [QTabs](https://quasar.dev/vue-components/tabs#introduction), apesar de ser um wrapper, não repassa as propriedades para o mesmo.

<doc-api file="tabs-generator/QasTabsGenerator" name="QasTabsGenerator" />

:::tip
Você pode enviar o contador de cada label tanto pela propriedade `counters` quanto dentro da propriedade `tabs`, exemplo:

**Cenário 1**:
```js
const tabs = {
  tab1: 'Tab 1',
  tab2: 'Tab 2'
}

const counters = { tab: 2, tab2: 5 }
```

**Cenário 2**:
```js
const tabs = [
  {
    label: 'Tab 1',
    value: 'tab1',
    icon: 'sym_r_person',
    counter: 2
  },
  {
    label: 'Tab 2',
    value: 'tab2',
    icon: 'sym_r_person',
    counter: 5
  },
]
```

**Cenário 3**:
```js
const tabs = [
  {
    label: 'Tab 1',
    value: 'tab1',
    icon: 'sym_r_person'
  },
  {
    label: 'Tab 2',
    value: 'tab2',
    icon: 'sym_r_person'
  },
]

const counters = { tab: 2, tab2: 5 }
```

A prioridade do contador **sempre** vai ser da propriedade `counters`
:::

:::tip
O uso recomendado da propriedade `tabs` é como array.
:::

## Uso

<doc-example file="QasTabsGenerator/Basic" title="Básico" />
<doc-example file="QasTabsGenerator/QuerySlug" title="Alteração automática via prop querySlug" />
<doc-example file="QasTabsGenerator/ExWithIcon" title="Tabs com ícone" />
<doc-example file="QasTabsGenerator/ExWithStatus" title="Tabs com status" />
<doc-example file="QasTabsGenerator/ExWithCounter" title="Tabs com contador na propriedade tabs" />

:::tip
Saiba mais sobre o funcionamento do `QRouteTab` na [documentação do Quasar](https://quasar.dev/vue-components/tabs#qroutetab-api)
:::

:::warning
O exemplo abaixo não funcionará corretamente na documentação, devido a rota passada no `to` não existir.
:::

:::warning
Ao usar o `QRouteTab` não é recomendado usar também um `v-model` (embora você ainda possa), porque a fonte da verdade para a tab ativa atual é determinada pela rota atual em vez do `v-model`. Cada `QRouteTab` torna-se “ativo” dependendo da rota do seu app e não devido ao `v-model`. Portanto, o valor inicial do `v-model` ou a alteração direta do `v-model` também não alterará a rota do seu app.
:::
<doc-example file="QasTabsGenerator/RouteTab" title="Tabs com QRouteTab" />

<doc-example file="QasTabsGenerator/CustomSlotTab" title="Slot: tab-[nome-da-chave]" />
<doc-example file="QasTabsGenerator/CustomSlotAfter" title="Slot: tab-after-[nome-da-chave]" />
