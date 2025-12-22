<template>
  <div class="container spaced">
    <qas-btn
      label="Abrir dialog"
      @click="openDialog"
    />

    <qas-dialog v-model="showDialog">
      <template #description>
        <div class="q-mb-md">
          Este é um exemplo de um QasCard dentro de um QasDialog.
        </div>

        <qas-card :route="{ name: 'Root' }" title="Titulo">
          <template #default>
            <div>
              Meu conteúdo
            </div>
          </template>
        </qas-card>
      </template>
    </qas-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'InsideDialog' })

// refs
const showDialog = ref(false)

// functions
function openDialog () {
  showDialog.value = true
}
</script>
