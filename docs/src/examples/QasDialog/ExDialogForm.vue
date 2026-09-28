<template>
  <div class="container q-py-lg">
    <qas-btn label="Abrir Dialog" @click="toggle" />

    <qas-dialog v-model="isDialogOpened" v-bind="dialogProps">
      <template #description>
        <div>
          <qas-input v-model="text" :rules="[value => value.length > 3 || 'error']" />
          <qas-input v-model="text2" :rules="[value => value.length > 3 || 'error']" />
        </div>
      </template>
    </qas-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'ExDialogForm' })

// refs
const isDialogOpened = ref(false)
const text = ref('')
const text2 = ref('')

// consts
const dialogProps = {
  title: 'Título do dialog',
  description: 'Cerca elétrica perto do corrimão risco iminente de choque. Código da ordem de serviço: 159488 CRM ID: 1179512',
  useForm: true
}

// functions
function toggle () {
  isDialogOpened.value = !isDialogOpened.value
}
</script>
