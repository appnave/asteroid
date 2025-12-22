---
title: QasSelectFilter
---

Componente de select que filtra adicionando query na URL, comumente utilizado para seleção

<doc-api file="select-filter/QasSelectFilter" name="QasSelectFilter" />

:::info
- Empresa default é referente a que estiver na URL.
- Toda vez que seleciona uma nova empresa é adicionado na URL.
- Evento `@update:modelValue` é disparado no created.
:::

## Uso
<doc-example file="QasSelectFilter/Basic" title="Básico" />
<doc-example file="QasSelectFilter/Multiple" title="Múltiplo" />
<doc-example file="QasSelectFilter/WithListView" title="Com list view" />
