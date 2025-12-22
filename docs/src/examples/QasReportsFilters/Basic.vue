<template>
  <div class="container spaced">
    <qas-reports-filters
      v-model="filtersModel"
      v-bind="reportsFiltersProps"
    >
      <template #default>
        <qas-list-view v-model:fields="fields" v-model:results="results" v-bind="listViewProps">
          <template #default>
            <qas-table-generator v-bind="tableGeneratorProps" />
          </template>
        </qas-list-view>
      </template>
    </qas-reports-filters>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'Basic' })

const filtersModel = ref({})
const fields = ref({})
const results = ref([])

// consts
const entity = 'users'

const reportsFiltersProps = {
  entity: 'users',
  label: 'Titulo do filtro',
  description: 'Descrição do filtro',
  url: 'users',
  useDefaultFilters: false
}

const listViewProps = {
  entity,
  useFilter: false,
  useBoundary: false,
  useResultsAreaOnly: true
}

// computeds
const tableGeneratorProps = computed(() => {
  return {
    fields: fields.value,
    results: results.value
  }
})
</script>
