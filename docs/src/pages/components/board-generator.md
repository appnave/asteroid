---
title: QasBoardGenerator
---

Componente usado para board de colunas.

<doc-api file="board-generator/QasBoardGenerator" name="QasBoardGenerator" />

## Uso

:::warning
##### beforeUpdatePosition
- Utilize a propriedade `beforeUpdatePosition` apenas em casos necessários, como validar um card antes de salvar a posição.
- propriedade que é um callback é utilizada para servir como um interceptador.

```js
function beforeUpdatePosition (context) {
  // context.event
  // context.cancel()
  // context.getItem()
  // context.getColumnTo()
  // context.getColumnFrom()
  // context.openConfirmDialog()
  // context.update()
}
```
:::

:::info
Normalmente componente utilizado junto com `QasListView` para pegar os headers, sendo realizado a requisição das colunas após o `fetchSuccess`.
Porém ainda sim é possível utilizar sem, sendo que precisa passar os headers fixos para buscar as colunas.
:::

:::info
Caso precise manipular os dados do model das colunas em camadas mais profundas, use a prop "use-mark-raw" como false.
:::

:::info
Utilize a prop "lazy-loading-fields-keys" para caso você tenha campos que são lazy loading e o back retorna somente
as options usadas no results atual. É feito um tratamento interno onde mergeamos as options, evitando duplicidade e
perca de dados com base nas buscas anteriores.

Exemplo de cenário:
- É feita uma busca para a página 1 onde o campo "realEstateDevelopment" possui as options [1, 2, 3, 4].
- É feita uma busca para a página 2, onde o campo "realEstateDevelopment" possui as options [4, 5, 6]
- Os itens da página 1 irá ter a perca de dados, já que não houve o merge das options, sendo necessário passar para o
componente a prop lazy-loading-fields-keys="['realEstateDevelopment']" para o componente cuidar do merge do campo
passado.
- Passando a prop o resultado será [1, 2, 3, 4, 5, 6]
:::

<doc-example file="QasBoardGenerator/Basic" title="Básico" />

#### Drag and Drop

:::warning
O Drag and Drop não funciona na documentação devido o SortableJS ser definido após sucesso na requisição dos elementos
e ao realizar o drop, realizar a requisição no endpoint de update.
:::

##### Para usar:
É possível utilizar o drag and drop tanto para transferências de colunas, quanto para para apenas ordenação
dentro de cada coluna. Esse controle é feito através das props: `useDragAndDropX` e `useDragAndDropY`,
sendo que quando houver alguma dessas propriedades, a funcionalidade é habilitada.

Além das props obrigatórias do próprio board, quando se utiliza o drag and drop, algumas propriedades precisam ser repassadas:
- `itemIdKey`: Identificador único de cada item, como por exemplo: uuid, id, etc.
- `updatePositionUrl`: URL no qual será realizado o PATCH para a atulização de posição.

As demais propriedades se tornam opcionais de acordo com seu uso.

##### Back-end
Para o funcionamento é necessário além das rotas de header e de colunas, uma rota de update, sendo usado o método PATCH.
Vamos supor que definimos a propriedade `updatePositionUrl` como: `board/cards`.

O rota do backend deverá ser: `${BaseURL}/board/cards/:id-do-card/update-position`. O ID do card será pego a partir do `itemIdKey` definido.
No payload será enviado o seguinte:
```js
{
  // Quando é utilizado o Drag and Drop X
  // Lembrando que column_id_key é uma propriedade obrigatória do próprio QasBoardGenerator.
  column_id_key: "id-da-coluna",

  // Quando é utilizado o Drag and Drop Y
  new_index: "nova-posição-do-card",

  ...updatePositionParams // Params adicionais que deseja informar.
}

```

O retorno do backend, deverá ser TODO o item atualizado em seu result, pois o componente irá pegar esse retorno para atualizar o model.
