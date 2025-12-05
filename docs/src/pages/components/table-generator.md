---
title: QasTableGenerator
---

Componente para criação de tabela dinâmica usando o `QTable` do Quasar.

<doc-api file="table-generator/QasTableGenerator" name="QasTableGenerator" />

:::info
##### QasBtn com padrões alterados via provide
Quando utilizar o QasBtn nos slots, eles terão seus padrões alterados internamente, isto significa que não é recomendado passar props `variant` e principalmente `size` diretamente no componente.

**Definição interna**
```js
provide () {
  return {
    /**
     * @see QasBtn.vue - Injetando os valores padrões para o QasBtn.
     */
    btnPropsDefaults: {
      size: 'md'
    }
  }
}
```
:::

:::info
##### data-* para lidar com hover em tabela
| Nome | Descrição |
|---------------------|-----------|
| `data-table-hover` | quando utilizamos `data-table-ignore-tr-hover` em um componente, ele vai remover todo o hover do componente como um todo, porém pode ter alguma área que queira o hover, então utilize este data na área desejada, exemplo no `QasCopy` |
| `data-table-ignore-hover` | ignora o hover no item especifico, exemplo no `QasBadge` |
| `data-table-ignore-tr-hover` | ignora o hover em todo tr, exemplo no `QasBtn` |
:::

:::tip
Ao utilizar o evento `@row-click` caso tenha algum componente / elemento HTML dentro do slot `body-cell-[field-name]` que queira ignorar, adicione o seguinte evento `@click.stop`.

Exemplo:
```html
<template #body-cell-actions="{ row }">
  <div class="flex justify-end no-wrap q-gutter-x-sm">
    <!-- aqui o @click.stop vai fazer com que este botão não dispare o evento: @row-click -->
    <qas-btn label="alguma ação!" @click.stop="alert('fui clicado')" />
  </div>
</template>
```
:::

## Uso

<doc-example file="QasTableGenerator/Basic" title="Básico" />
<doc-example file="QasTableGenerator/Selection" title="Selecionável" />

:::info
A propriedade "actionsMenuProps" adiciona automaticamente uma coluna "actions" na tabela e renderiza o `QasActionsMenu` por callback, é a maneira **correta** de se usar ação na ultima coluna.

A propriedade "fieldsProps" pode ser uma função ou objeto, é possível adicionar/personalizar componentes sem abrir slot via prop, componentes aceitos:

- QasActionsMenu
- QasBadge
- QasBtn
- QasCopy
- QasStatus
- QasTextTruncate
- QasToggleVisibility

Exemplo:
```js
fieldsProps: {
  document: {
    component: 'QasTextTruncate'
  },

  name: {
    component: 'QasTextTruncate',
    props: {
      maxWidth: 150
    }
  },

  email: {
    component: 'QasCopy'
  }
}
```
:::
<doc-example file="QasTableGenerator/WithFieldsProps" title="Com componentes por props e ação na ultima coluna" />
<doc-example file="QasTableGenerator/WithHeader" title="Com header" />
<doc-example file="QasTableGenerator/HeaderSlot" title="Acessando slot do header" />
<doc-example file="QasTableGenerator/NoBox" title="Sem box" />

Este componente renderiza componentes dinamicamente através da prop `fields`, cada field dentro de fields tem um `name`, através dele, você consegue acessar os slots dinâmicos.

<doc-example file="QasTableGenerator/CustomSlot" title="Slots personalizados" />

Também é possível configurar o componente para executar uma ação ao clicar em uma linha, para isso, basta escutar o evento `row-click`.

<doc-example file="QasTableGenerator/ClickableRow" title="Linha clicável" />

Caso queira que ao clicar em uma linha vá para outra rota, é possível utilizar a prop `row-route-fn` na qual o retorno deve ser com a estrutura aceita pelo vue-router.(a linha passa ser um `<a>` internamente, habilitando a opção de abrir em uma nova aba)

:::tip
Caso precise que a mudança de página seja um link externo, é possível utilizando a prop `use-external-link`, na qual o retorno da prop `row-route-fn` é esperado que seja um path.

Exemplo:
```html
<qas-table-generator :row-route-fn="rowExternalRouteFn" use-external-link />
```

```js
rowExternalRouteFn () {
  return 'https://asteroid.nave.dev/'
}
```
:::

<doc-example file="QasTableGenerator/TableLink" title="Tabela com links" />

Funcionalidade que permite que o cabeçalho da tabela permaneça visível na parte superior enquanto o usuário faz rolagem do conteúdo da tabela. Para utilizar atribua a prop `use-sticky-header`.

:::tip
É possível alterar a altura máxima da tabela utilizando a prop `max-height`.
:::

<doc-example file="QasTableGenerator/StickyHeader" title="Header fixo" />

:::warning
O virtual scroll renderiza dinamicamente as linhas a serem exibidas na tabela.
Apenas utilize virtual scroll quando realmente houver comportamentos no qual não se pode ter paginação e tiver muitos dados na tabela.
:::
<doc-example file="QasTableGenerator/WithVirtualScroll" title="Com virtual scroll" />
