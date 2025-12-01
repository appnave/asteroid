<template>
  <div class="container q-py-lg">
    <qas-tabs-generator v-model="model" :loading="isLoading" :tabs="tabs" />

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageLoading' })

// refs
const model = ref('tab1')
const isLoading = ref(true)

// consts
const tabs = [
  {
    label: 'Tab 1',
    value: 'tab1',
    status: 'positive',
    counter: 5
  },
  {
    label: 'Tab 2',
    value: 'tab2',
    status: 'negative',
    counter: 2
  },
  {
    label: 'Tab 3',
    value: 'tab3',
    status: 'positive',
    counter: 3
  },
  {
    label: 'Tab 4',
    value: 'tab4',
    status: 'negative',
    counter: 1
  },
  {
    label: 'Tab 5',
    value: 'tab5',
    status: 'positive',
    counter: 10
  }
]

// computeds
const buttonLabel = computed(() => isLoading.value ? 'Desativar loading' : 'Ativar loading')

// functions
function onClick () {
  isLoading.value = !isLoading.value
}
</script>
