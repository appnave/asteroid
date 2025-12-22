<template>
  <qas-list-view v-model:fields="viewState.fields" v-model:results="viewState.results" :entity use-auto-handle-on-delete>
    <template #header>
      <qas-page-header title="Lista de materiais" :use-breadcrumbs="false">
        <qas-btn icon="sym_r_add" label="Novo [item]" />
      </qas-page-header>
    </template>

    <template #default>
      <qas-table-generator v-bind="tableGeneratorProps">
        <template #body-cell-isActive="{ row }">
          <div class="text-weight-bold">{{ row.isActive }}</div>
        </template>
      </qas-table-generator>
    </template>
  </qas-list-view>
</template>

<script setup>
import { computed } from 'vue'
import { useView } from '@bildvitta/composables'

defineOptions({ name: 'CommonUsage' })

// composables
const { viewState } = useView({ mode: 'list' })

// consts
const entity = 'users'

// computeds
const tableGeneratorProps = computed(() => {
  return {
    rowKey: 'uuid',
    fields: viewState.value.fields,
    results: viewState.value.results,
    columns: ['name', 'email', 'isActive'],

    actionsMenuProps: row => {
      return {
        deleteProps: {
          deleteActionParams: {
            entity,
            id: row.uuid
          }
        }
      }
    }
  }
})
</script>
