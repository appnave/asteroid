<template>
  <div class="container spaced">
    <qas-overlay-router-link v-bind="props" />
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const props = {
  overlayRoute: { name: 'Root', query: { overlay: 'true' } },
  route: { name: 'Root' },
  label: 'Link com rota de overlay'
}
</script>
