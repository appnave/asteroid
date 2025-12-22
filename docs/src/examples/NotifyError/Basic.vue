<template>
  <div class="container spaced text-center">
    <div>
      <qas-btn @click="$qas.error(message)">Usando plugin com injeção</qas-btn>
    </div>

    <div class="q-mt-lg">
      <qas-btn @click="NotifyError(message)">Usando plugin com import</qas-btn>
    </div>
  </div>
</template>

<script setup>
import { NotifyError } from 'asteroid'

defineOptions({ name: 'Basic' })

const message = 'Não conseguimos carregar a imagem. Por favor, tente novamente em alguns minutos.'
</script>
