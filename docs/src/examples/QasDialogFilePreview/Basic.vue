<template>
  <div class="container q-py-lg">
    <qas-btn label="Visualizar imagem" @click="toggle" />

    <qas-dialog-file-preview
      v-model="showDialog"
      v-bind="previewProps"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

// refs
const showDialog = ref(false)

// consts
const previewProps = {
  title: 'Visualizar imagem',
  url: 'https://placehold.co/1000x600',
  fileName: 'imagem-exemplo'
}

// functions
function toggle () {
  showDialog.value = !showDialog.value
}
</script>
