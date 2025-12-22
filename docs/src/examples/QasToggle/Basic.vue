<template>
  <div class="container q-gutter-y-lg spaced">
    <div>
      <qas-toggle v-model="model" label="Aceitar" />
    </div>

    <div>
      <qas-toggle v-model="model2" label="Aceitar" />
    </div>

    <div>
      <qas-toggle v-model="model" disable label="Aceitar" />
    </div>

    <div>
      <qas-toggle v-model="model2" disable label="Aceitar" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const model = ref(false)
const model2 = ref(true)
</script>
