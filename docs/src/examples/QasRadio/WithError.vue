<template>
  <div class="container spaced">
    <qas-radio v-model="model" error error-message="Campo obrigatório" label="Com opções" :options />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithError' })

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
