<template>
  <div class="container spaced">
    <qas-select-filter class="q-mb-lg" :options />

    <qas-chart-view entity="charts" type="bar" />
  </div>
</template>

<script setup>
defineOptions({ name: 'BarWithSelectFilter' })

const options = [
  {
    label: 'Empresa 1',
    value: '1'
  },
  {
    label: 'Empresa 2',
    value: '2'
  },
  {
    label: 'Empresa 3',
    value: '3'
  },
  {
    label: 'Empresa 4',
    value: '4'
  },
  {
    label: 'Empresa 5',
    value: '5'
  }
]
</script>
