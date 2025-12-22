<template>
  <qas-list-view v-model:fields="viewState.fields" v-model:results="viewState.results" :before-fetch="onBeforeFetch" :entity :use-query-pagination="false">
    <template #header>
      <qas-page-header title="Lista de materiais" :use-breadcrumbs="false">
        <qas-btn icon="sym_r_add" label="Novo [item]" />
      </qas-page-header>
    </template>

    <template #default>
      <qas-table-generator :columns :fields="viewState.fields" :results="viewState.results" row-key="uuid" />
    </template>
  </qas-list-view>
</template>

<script setup>
import { useView } from '@bildvitta/composables'

const { viewState } = useView({ mode: 'list' })

const columns = [
  'isActive',
  'name',
  'company'
]

const entity = 'users'

function onBeforeFetch ({ resolve, payload }) {
  const { filters, page } = payload

  resolve({
    filters: { ...filters, isActive: true },
    page
  })
}
</script>
