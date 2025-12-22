<template>
  <div class="container q-py-lg">
    <qas-grid-item v-bind="firstGridItemProps" />

    <qas-grid-item class="q-mt-lg" v-bind="secondGridItemProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithCustomTypography' })

const firstGridItemProps = {
  content: {
    typography: 'h4'
  },
  label: 'Nome',
  useInline: true,
  value: 'John doe'
}

const secondGridItemProps = {
  content: {
    typography: 'h4'
  },
  label: 'Nome',
  value: 'John doe'
}
</script>
