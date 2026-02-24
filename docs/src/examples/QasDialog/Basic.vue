<template>
  <div class="container q-py-lg">
    <qas-btn label="Abrir Dialog" @click="toggle" />

    <qas-dialog v-model="isDialogOpened" v-bind="dialogProps" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

// refs
const isDialogOpened = ref(false)

const dialogProps = {
  title: 'Título do dialog',
  description: 'Cerca elétrica perto do corrimão risco iminente de choque. Código da ordem de serviço: 159488 CRM ID: 1179512',
  useForm: false,
  useAutoCloseOnOk: false
}

// functions
function toggle () {
  isDialogOpened.value = !isDialogOpened.value
}
</script>
