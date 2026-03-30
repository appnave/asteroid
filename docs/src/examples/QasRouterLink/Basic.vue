<template>
  <div class="container spaced">
    <qas-router-link v-bind="props" />
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const props = {
  useOverlayRoute: true,
  route: { name: 'Root' },
  label: 'Link com rota de overlay'
}
</script>
