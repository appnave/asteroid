<template>
  <div class="container q-py-lg">
    <qas-btn label="Abrir dialog" @click="openDialog" />

    <qas-dialog v-model="showDialog">
      <template #description>
        <div class="q-mb-md">
          Texto de descrição dentro do dialog
        </div>

        <qas-alert v-bind="alertProps" />
      </template>
    </qas-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'InsideDialog' })

// refs
const showDialog = ref(false)

// consts
const alertProps = {
  buttonProps: {
    onClick: () => alert('Button clicked')
  },

  text: 'Usuário incompleto, [clique aqui] para completar.',

  useRegex: true
}

// functions
const openDialog = () => {
  showDialog.value = true
}
</script>
