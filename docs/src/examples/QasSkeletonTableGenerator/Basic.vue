<template>
  <qas-container>
    <qas-skeleton-table-generator v-bind="tableGeneratorProps" />
  </qas-container>
</template>

<script setup>
// import { fields, results } from 'src/mocks/users'

defineOptions({ name: 'Basic' })

const columns = [
  'name',
  'createdAt',
  'date',
  'document',
  'email',
  'observation'
]

function actionsMenuProps (row) {
  return {
    list: {
      item: {
        label: 'Editar',
        icon: 'sym_r_edit'
      }
    }
  }
}

const tableGeneratorProps = {
  columns,
  actionsMenuProps,
  fieldsProps: {
    name: {
      component: 'QasBadge'
    },

    document: {
      component: 'QasToggleVisibility'
    },

    email: {
      component: 'QasTextTruncate'
    }
  }
  // fields,
  // results
}
</script>
