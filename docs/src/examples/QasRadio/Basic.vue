<template>
  <div class="container spaced">
    <div>
      <qas-radio v-model="model" label="Opção 1" val="1" />
    </div>

    <div class="q-mt-lg">
      <qas-radio v-model="model" disable label="Opção 1" val="1" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const model = ref('')
</script>
