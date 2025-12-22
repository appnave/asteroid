<template>
  <div class="container q-gutter-y-lg spaced">
    <qas-checkbox v-model="model" label="Checkbox com children" :options="optionsChildren" />

    <qas-checkbox v-model="model" disable label="Checkbox com children" :options="optionsChildren" />

    <qas-checkbox v-model="model" error label="Checkbox com children" :options="optionsChildren" />

    <qas-checkbox v-model="model" error error-message="Mensagem de erro" label="Checkbox com children" :options="optionsChildren" />

    <qas-debugger :inspect="[model]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Children' })

const model = ref([])

const optionsChildren = [
  {
    label: 'Selecionar todos',
    value: 1,
    children: [
      {
        label: 'Opção 2',
        value: 2
      },
      {
        label: 'Opção 3',
        value: 3
      },
      {
        label: 'Opção 4',
        value: 4
      },
      {
        label: 'Opção 5',
        value: 5
      }
    ]
  }
]
</script>
