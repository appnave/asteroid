<template>
  <div class="container spaced">
    <qas-filters v-bind="filtersProps1" />

    <q-separator class="q-mb-xl" />

    <qas-filters v-bind="filtersProps2" />

    <q-separator class="q-mb-xl" />

    <qas-filters v-bind="filtersProps3" />

    <q-separator class="q-mb-xl" />

    <qas-filters v-bind="filtersProps4" />
  </div>
</template>

<script setup>
defineOptions({ name: 'OrderBy' })

const orderByOptions = [
  {
    label: 'Mais recentes',
    value: 'created_at_desc'
  },
  {
    label: 'Mais antigos',
    value: 'created_at_asc'
  }
]

const filtersProps1 = {
  entity: 'users',
  orderByOptions
}

const filtersProps2 = {
  entity: 'users',
  useFilterButton: false,
  orderByOptions
}

const filtersProps3 = {
  entity: 'users',
  useSearch: false,
  orderByOptions
}

const filtersProps4 = {
  entity: 'users',
  useSearch: false,
  useFilterButton: false,
  orderByOptions
}
</script>
