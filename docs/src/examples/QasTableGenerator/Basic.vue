<template>
  <qas-container>
    <qas-table-generator :columns :fields loading :results />
  </qas-container>
</template>

<script setup>
import { fields, results } from 'src/mocks/users'

defineOptions({ name: 'Basic' })

const columns = [
  { sortable: false, name: 'isActive' },
  'name',
  'createdAt',
  'date'
]
</script>
