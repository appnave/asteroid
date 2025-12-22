<template>
  <div class="container spaced">
    <div>
      <qas-numeric-input v-model="integer" label="integer" use-negative />
      integer: {{ integer }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="decimal" label="decimal" mode="decimal" use-negative />
      decimal: {{ decimal }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="percent" label="percent" mode="percent" use-negative />
      percent: {{ percent }}
    </div>
    <div class="q-my-lg">
      <qas-numeric-input v-model="money" label="money" mode="money" use-negative />
      money: {{ money }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const integer = ref(-10)
const decimal = ref(-0.10)
const percent = ref(-0.10)
const money = ref(-0.10)
</script>
