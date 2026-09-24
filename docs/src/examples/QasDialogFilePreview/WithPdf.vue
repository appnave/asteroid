<template>
  <div class="container q-py-lg">
    <qas-input v-model="pdfUrl" class="q-mb-md" label="link do PDF" />

    <qas-btn label="Visualizar PDF" @click="toggle" />

    <qas-dialog-file-preview
      v-model="showDialog"
      v-bind="previewProps"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'WithPdf' })

// refs
const showDialog = ref(false)
const pdfUrl = ref('https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf')

// computeds
const previewProps = computed(() => {
  return {
    title: 'Visualizar PDF',
    url: pdfUrl.value,
    fileName: 'pdf-exemplo'
  }
})

// functions
function toggle () {
  showDialog.value = !showDialog.value
}
</script>
