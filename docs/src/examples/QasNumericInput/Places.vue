<template>
  <div class="container spaced">
    <div class="q-my-lg">
      <qas-numeric-input v-model="firstPercent" label="Uma casa" mode="percent" :places="1" />
      Com uma casa decimal: {{ firstPercent }}
    </div>

    <div class="q-my-lg">
      <!-- Default pra places é 2, por isso não é passado a prop -->
      <qas-numeric-input v-model="secondPercent" label="Duas casas" mode="percent" />
      Com duas casas decimais: {{ secondPercent }}
    </div>

    <div class="q-my-lg">
      <qas-numeric-input v-model="thirdPercent" label="Três casas" mode="percent" :places="3" />
      Com três casas decimais: {{ thirdPercent }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Places' })

const firstPercent = ref(0.12)
const secondPercent = ref(0.1234)
const thirdPercent = ref(0.12345)
</script>
