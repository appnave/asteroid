<template>
  <div class="container spaced">
    <div>
      <qas-numeric-input v-model="integer" icon="sym_r_person" label="integer" />
      integer: {{ integer }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="decimal" label="decimal" mode="decimal" />
      decimal: {{ decimal }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="percent" label="percent" mode="percent" />
      percent: {{ percent }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="money" label="money" mode="money" />
      money: {{ money }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Basic' })

const integer = ref(undefined)
const decimal = ref(0.10)
const percent = ref(0.10)
const money = ref(0.10)
</script>
