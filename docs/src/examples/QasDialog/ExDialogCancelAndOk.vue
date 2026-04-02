<template>
  <div class="container q-py-lg">
    <qas-btn label="Abrir Dialog" @click="toggle" />

    <qas-dialog v-model="isDialogOpened" v-bind="dialogProps">
      <template #description>
        <qas-field v-model="description" :field="field" label="Descrição" />
      </template>
    </qas-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

defineOptions({ name: 'ExDialogCancelAndOk' })

// composables
const qas = inject('qas')

// refs
const isDialogOpened = ref(false)
const isLoading = ref(false)
const description = ref('')

// computed
const dialogProps = computed(() => ({
  useForm: true,
  title: 'Título do dialog',
  ok: {
    label: 'Fechar',
    loading: isLoading.value
  },
  onCancel,
  onOk
}))

const field = {
  name: 'description',
  type: 'text',
  label: 'Descrição'
}

// functions
function toggle () {
  isDialogOpened.value = !isDialogOpened.value
}

function onCancel () {
  isDialogOpened.value = false
  qas.error('Evento cancel finalizado.')
}

function onOk () {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    isDialogOpened.value = false
  }, 2000)
}
</script>
