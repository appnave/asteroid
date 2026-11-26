<template>
  <qas-container>
    <qas-table-generator v-bind="tableGeneratorProps" />
  </qas-container>
</template>

<script setup>
import { fields, results } from 'src/mocks/users'

defineOptions({ name: 'WithHightlight' })

const tableGeneratorProps = {
  results,
  fields,
  columns: ['name', 'isActive', 'company', 'document', 'email'],

  maxHeight: '500px',
  useVirtualScroll: true,

  useGroups: true,
  groups: {
    first: {
      label: 'Primeiro grupo',
      fields: ['isActive', 'company']
    },

    second: {
      label: 'Segundo grupo',
      fields: ['document', 'email']
    }
  },

  highlights: ({ index }) => {
    // Adicionar destaque somente na quarta linha.
    if (index === 3) return true
  },

  useStickyLastRow: true
}
</script>
