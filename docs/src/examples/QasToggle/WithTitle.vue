<template>
  <div class="container q-gutter-y-lg spaced">
    <div>
      <qas-toggle v-model="model" label="Aceitar" title="Titulo" />
    </div>

    <div>
      <qas-toggle v-model="model2" label="Aceitar" title="Titulo" />
    </div>

    <div>
      <qas-toggle v-model="model" disable label="Aceitar" title="Titulo" />
    </div>

    <div>
      <qas-toggle v-model="model2" disable label="Aceitar" title="Titulo" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithTitle' })

// refs
const model = ref(false)
const model2 = ref(false)
</script>
