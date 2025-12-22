<template>
  <div class="container q-my-xl">
    <qas-select-filter v-model="company" :options />

    <qas-debugger :inspect="[company]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const company = ref('')

const options = ref([
  {
    label: 'Empresa 1',
    value: 'company-1'
  },
  {
    label: 'Empresa 2',
    value: 'company-2'
  },
  {
    label: 'Empresa 3',
    value: 'company-3'
  },
  {
    label: 'Empresa 4',
    value: 'company-4'
  },
  {
    label: 'Empresa 5',
    value: 'company-5'
  }
])
</script>
