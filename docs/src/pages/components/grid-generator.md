---
title: QasGridGenerator
---

Componente para criação de textos dinâmicos.

<doc-api file="grid-generator/QasGridGenerator" name="QasGridGenerator" />

:::info
Caso os breakpoints dos campos sejam todos iguais, exemplo:
- Possuo os campos name e phone, e ambos precisam ter os breakpoints `{ xs: 12, lg: 6 }`.

É possível passar o `columns` sem especificar os fields, somente um objeto com os breakpoints, mas
é necessário utilizar a prop `use-common-columns` para que isso funcione.
:::

:::info
- Ao utilizar a prop `useInline`, o gutter passa a ter o valor `md`.
- Ao abrir slots `field-[nome-da-chave]` tente utilizar o componente `QasGridItem`.
:::

:::info
Ao utilizar a prop `useEllipsis` não irá afetar campos textarea, pois campos com esse tipo deverão sempre serem exibidos
por completo.
:::

## Uso
<doc-example file="QasGridGenerator/Basic" title="Básico" />
<doc-example file="QasGridGenerator/BoxAndHeader" title="Box e header" />
<doc-example file="QasGridGenerator/ExGridCommonColumns" title="Common Columns" />
<doc-example file="QasGridGenerator/Slots" title="Slots" />
<doc-example file="QasGridGenerator/UseInline" title="Inline" />

:::info
Por padrão, entre `subsets` terá separadores, mas é possível controlar passando um `useSeparator: false` caso não seja necessário. Para o `fieldset`, o padrão é que não tenha separadores entre eles, mas é possível passar um `useSeparator: true`.
:::
<doc-example file="QasGridGenerator/WithFieldset" title="Com fieldset" />

:::info
É possível adicionar um tip ou alterar a tipografia de um item através do `fieldsProps`.
:::
<doc-example file="QasGridGenerator/WithFieldsProps" title="Com fieldsProps" />
