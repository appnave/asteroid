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
  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgOCyW9n3Tfu3QNbQUSByqsIvNxOVgXk66D_fAz1Zu2A3yVrHD6wUOlgc9&s=10',
  fileName: 'imagem-exemplo'
}

// functions
function toggle () {
  showDialog.value = !showDialog.value
}
</script>
