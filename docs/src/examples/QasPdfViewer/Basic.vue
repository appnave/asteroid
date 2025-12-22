<template>
  <div class="container spaced">
    <qas-pdf-viewer :url />
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const url = 'https://pdfobject.com/pdf/sample.pdf'
</script>
