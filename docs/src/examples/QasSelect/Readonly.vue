<template>
  <div class="container q-col-gutter-lg q-py-lg row">
    <div class="col-6">
      <qas-select v-model="model" label="Meu select readonly" :options readonly />
    </div>

    <div class="col-6">
      <qas-select v-model="model2" label="Meu select múltiplo readonly" multiple :options readonly />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'Readonly' })

import { ref } from 'vue'

const model = ref(1)
const model2 = ref([1, 2])

const options = [
  { label: 'Opção 1', value: 1 },
  { label: 'Opção 2', value: 2 },
  { label: 'Opção 3', value: 3 },
  { label: 'Opção 4', value: 4 },
  { label: 'Opção 5', value: 5 },
  { label: 'Opção 6', value: 6 },
  { label: 'Opção 7', value: 7 },
  { label: 'Opção 8', value: 8 },
  { label: 'Opção 9', value: 9 },
  { label: 'Opção 10', value: 10 },
  { label: 'Opção 11', value: 11 },
  { label: 'Opção 12', value: 12 },
  { label: 'Opção 13', value: 13 },
  { label: 'Opção 14', value: 14 },
  { label: 'Opção 15', value: 15 }
]
</script>
