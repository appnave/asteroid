<template>
  <div class="container spaced text-center">
    <div>
      <qas-btn @click="$qas.success(message)">Usando plugin com injeção</qas-btn>
    </div>

    <div class="q-mt-lg">
      <qas-btn @click="NotifySuccess(message)">Usando plugin com import</qas-btn>
    </div>
  </div>
</template>

<script setup>
import { NotifySuccess } from 'asteroid'

defineOptions({ name: 'Basic' })

const message = 'Dados alterados com sucesso.'
</script>
