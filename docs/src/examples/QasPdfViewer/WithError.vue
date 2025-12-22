<template>
  <div class="container spaced">
    <qas-pdf-viewer :url />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithError' })

const url = 'https://example.com/invalid-pdf-url.pdf'
</script>
