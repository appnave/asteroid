<template>
  <div class="container spaced">
    <div>
      <qas-radio v-model="model" label="Com opções" :options />
    </div>

    <div class="q-mt-lg">
      <qas-radio v-model="model" disable label="Com opções desabilitadas" :options />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'OptionGroup' })

const model = ref('')

const options = [
  {
    label: 'Opção 1',
    value: '1'
  },
  {
    label: 'Opção 2',
    value: '2'
  },
  {
    label: 'Opção 3',
    value: '3'
  }
]
</script>
