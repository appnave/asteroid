<template>
  <qas-table-generator v-bind="tableGeneratorProps" />
</template>

<script setup>
import { fields, results } from 'src/mocks/users'

defineOptions({ name: 'WithFieldsProps' })

const tableGeneratorProps = {
  fields,
  results,

  columns: [
    'isActive',
    'document',
    'companies',
    'createdAt',
    'company',
    'date',
    'email',
    'observation'
  ],

  actionsMenuProps (row) {
    return {
      list: {
        visibility: {
          label: 'Visibilidade',
          icon: 'sym_r_person',
          handler: () => alert(row.uuid)
        },
        edit: {
          label: 'Editar',
          icon: 'sym_r_edit',
          handler: () => alert(row.uuid)
        }
      }
    }
  },

  fieldsProps (row) {
    return {
      isActive: {
        component: 'QasStatus',
        props: {
          color: row.default.isActive ? 'green' : 'red'
        }
      },

      createdAt: {
        component: 'QasBadge'
      },

      companies: {
        component: 'QasTextTruncate',
        props: {
          list: row.companies,
          maxVisibleItems: 1
        }
      },

      document: {
        component: 'QasToggleVisibility'
      },

      name: {
        component: 'QasTextTruncate',
        props: {
          maxWidth: 150
        }
      },

      company: {
        component: 'QasBtn',
        props: {
          size: 'lg',
          onClick: () => alert(row.company)
        }
      },

      email: {
        component: 'QasCopy'
      },

      observation: {
        component: 'QasTextTruncate'
      }
    }
  },

  onRowClick: () => alert('Clicando na linha')
}
</script>
