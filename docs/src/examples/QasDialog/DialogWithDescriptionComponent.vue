<template>
  <div class="container q-py-lg">
    <qas-btn label="Abrir Dialog" @click="toggle" />

    <qas-dialog v-model="isDialogOpened" v-bind="dialogProps" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DescriptionComponent from './DescriptionComponent.vue'

defineOptions({ name: 'DialogWithDescriptionComponent' })

// refs
const isDialogOpened = ref(false)

const dialogProps = {
  title: 'Título do dialog',
  description: DescriptionComponent
}

// functions
function toggle () {
  isDialogOpened.value = !isDialogOpened.value
}
</script>
