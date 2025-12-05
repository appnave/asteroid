<template>
  <qas-table-generator :columns :fields :results />
</template>

<script setup>
import { fields, results } from 'src/mocks/users'

defineOptions({ name: 'Basic' })

const columns = [
  { tooltip: 'Tooltip de exemplo', name: 'isActive' },
  'name',
  'createdAt',
  'date'
]
</script>
