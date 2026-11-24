<template>
  <div class="container q-py-lg">
    <qas-tabs-generator v-model="model" :skeleton="showSkeleton" :tabs />

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const model = ref('tab1')
const showSkeleton = ref(true)

// consts
const tabs = [
  {
    label: 'Tab 1',
    value: 'tab1',
    status: 'positive',
    counter: 0
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
    counter: 0
  },
  {
    label: 'Tab 5',
    value: 'tab5',
    status: 'positive',
    counter: 10
  }
]

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
