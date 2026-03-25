<template>
  <div class="container spaced">
    <qas-overlay-router-link
      :overlay-route="{ name: 'Root', query: { overlay: 'true' } }"
      :route="{ name: 'Root' }"
      title="Link com rota de overlay"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })
</script>
