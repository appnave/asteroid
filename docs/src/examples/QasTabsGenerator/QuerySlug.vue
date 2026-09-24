<template>
  <div class="container q-py-lg">
    <qas-tabs-generator v-model="model" v-bind="tabsProps" />

    <div class="q-my-lg">
      model: {{ model }}
    </div>

    <qas-btn label="Mudar a query" @click="changeQuery" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PageQuerySlug' })

// composables
const router = useRouter()

// refs
const model = ref('tab1')

// consts
const tabsProps = {
  tabs: {
    tab1: 'Tab 1',
    tab2: 'Tab 2',
    tab3: 'Tab 3'
  },

  counters: {
    tab1: 5,
    tab2: 10
  },

  querySlug: 'activeTab'
}

// functions
function changeQuery () {
  router.push({ query: { activeTab: 'tab2' } })
}
</script>
