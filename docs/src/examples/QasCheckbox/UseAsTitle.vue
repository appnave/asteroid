<template>
  <div class="container spaced">
    <div class="q-my-lg">
      <qas-checkbox v-model="model" :false-value="false" label="Aceitar" :true-value="true" use-as-title />
    </div>

    <qas-expansion-item>
      <template #header>
        <qas-checkbox v-model="model" :false-value="false" label="Aceitar" :true-value="true" use-as-title />
      </template>

      <template #content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, dolor.
      </template>
    </qas-expansion-item>

    <qas-expansion-item class="q-mt-lg" error>
      <template #header>
        <qas-checkbox v-model="model" error :false-value="false" label="Aceitar" :true-value="true" use-as-title />
      </template>

      <template #content>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, dolor.
      </template>
    </qas-expansion-item>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'UseAsTitle' })

const model = ref(false)
</script>
