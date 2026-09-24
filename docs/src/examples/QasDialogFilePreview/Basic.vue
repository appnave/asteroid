<template>
  <div class="container q-py-lg">
    <qas-input v-model="imageUrl" class="q-mb-md" label="link da imagem" />

    <qas-btn label="Visualizar imagem" @click="toggle" />

    <qas-dialog-file-preview
      v-model="showDialog"
      v-bind="previewProps"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'Basic' })

// refs
const showDialog = ref(false)
const imageUrl = ref('https://placehold.co/1000x600')

// computeds
const previewProps = computed(() => {
  return {
    title: 'Visualizar imagem',
    url: imageUrl.value,
    fileName: 'imagem-exemplo'
  }
})

// functions
function toggle () {
  showDialog.value = !showDialog.value
}
</script>
