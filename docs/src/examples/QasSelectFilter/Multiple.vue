<template>
  <div class="container q-my-xl">
    <qas-select-filter v-model="properties" multiple name="properties" :options />

    <qas-debugger :inspect="[properties]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Multiple' })

const properties = ref([])

const options = [
  {
    label: 'Propriedade 1',
    value: 'property-1'
  },
  {
    label: 'Propriedade 2',
    value: 'property-2'
  },
  {
    label: 'Propriedade 3',
    value: 'property-3'
  },
  {
    label: 'Propriedade 4',
    value: 'property-4'
  },
  {
    label: 'Propriedade 5',
    value: 'property-5'
  }
]
</script>
