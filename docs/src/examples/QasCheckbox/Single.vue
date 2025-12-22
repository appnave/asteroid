<template>
  <div class="container q-gutter-y-lg spaced">
    <qas-checkbox v-model="model" :false-value="false" label="Aceitar" :true-value="true" />

    <qas-checkbox v-model="model" disable :false-value="false" label="Aceitar" :true-value="true" />

    <qas-checkbox v-model="model" error :false-value="false" label="Aceitar" :true-value="true" />

    <qas-debugger :inspect="[model]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Single' })

const model = ref(false)
</script>
