<template>
  <div class="column container spaced text-center">
    <qas-btn label="Usando plugin com injeção" @click="$qas.dialog(dialogConfig)" />

    <qas-btn label="Usando plugin com import" @click="Dialog(dialogConfig)" />
  </div>
</template>

<script setup>
import { Dialog } from 'asteroid'

defineOptions({ name: 'PageBasic' })

const dialogConfig = {
  title: 'Título do dialog',
  description: 'Descrição do dialog.',
  cancel: {
    label: 'Fechar'
  }
}
</script>
