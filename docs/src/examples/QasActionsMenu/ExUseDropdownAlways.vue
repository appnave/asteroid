<template>
  <div class="container q-py-lg">
    <qas-actions-menu v-bind="props" />
  </div>
</template>

<script setup>
const list = {
  visibility: {
    icon: 'sym_r_visibility',
    label: 'Visualizar',
    handler: () => alert('handler ativado')
  }
}

const props = {
  list,
  useDropdownAlways: true
}
</script>
