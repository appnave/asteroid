<template>
  <div class="container spaced">
    <qas-search-input v-model="search" />

    <qas-search-input v-model="search" class="q-mt-lg" error error-message="Mensagem de erro" />

    <div class="q-mt-lg">
      Model: {{ search }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const search = ref('')
</script>
