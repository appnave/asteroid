<template>
  <div class="q-py-md" style="height: 500px; background-color: var(--qas-background-color);">
    <qas-board-generator
      v-model:results="resultsColumns"
      column-id-key="id"
      column-url="url-example"
      :confirm-dialog-props
      :headers
      height="400px"
      use-confirm-dialog
    >
      <template #header-column="{ header }">
        <div class="flex justify-between text-subtitle1">
          <div>{{ header.name }}</div>
        </div>
      </template>

      <template #column-item="{ item }">
        <qas-box
          class="full-width q-mb-lg"
          style="height: 200px;"
        >
          <div class="q-mb-lg">
            Card - {{ item.card }}
          </div>
        </qas-box>
      </template>
    </qas-board-generator>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const resultsColumns = ref({
  /*
  * Somente de exemplo, quando na verdade o componente será responsável por bater
  * as APIs das colunas com base no headers fornecidos. É possível manipular as
  * colunas do lado de fora através deste model, como neste exemplo.
  */
  'col-1': [
    { card: 'item 1 da coluna 1' },
    { card: 'item 2 da coluna 1' },
    { card: 'item 3 da coluna 1' }
  ],
  'col-2': [
    { card: 'item 1 da coluna 2' },
    { card: 'item 2 da coluna 2' },
    { card: 'item 3 da coluna 2' }
  ],
  'col-3': [
    { card: 'item 1 da coluna 3' },
    { card: 'item 2 da coluna 3' },
    { card: 'item 3 da coluna 3' }
  ]
})

/*
* Headers na qual deverá fornecer para o componente.
*/
const headers = [
  {
    id: 'col-1',
    name: 'Coluna 1'
  },
  {
    id: 'col-2',
    name: 'Coluna 2'
  },
  {
    id: 'col-3',
    name: 'Coluna 3'
  }
]

const confirmDialogProps = {
  title: 'Confirmar ação',
  description: 'Tem certeza que deseja realizar esta ação?'
}
</script>
