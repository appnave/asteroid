<template>
  <div class="container q-py-lg">
    <qas-btn label="Visualizar PDF" @click="toggle" />

    <qas-dialog-file-preview
      v-model="showDialog"
      v-bind="previewProps"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithPdf' })

// refs
const showDialog = ref(false)

// consts
const previewProps = {
  title: 'Visualizar PDF',
  url: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf',
  fileName: 'pdf-exemplo'
}

// functions
function toggle () {
  showDialog.value = !showDialog.value
}
</script>
