<template>
  <qas-box class="container q-my-md spaced">
    <qas-search-input v-model="search" />

    <qas-search-input v-model="search" class="q-mt-lg" error error-message="Mensagem de erro" />

    <div class="q-mt-lg">
      Model: {{ search }}
    </div>
  </qas-box>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'InsideBox' })

const search = ref('')
</script>
