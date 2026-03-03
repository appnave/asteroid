<template>
  <div ref="columnContainer">
    <slot />
  </div>
</template>

<script setup>

import setScrollGradient from '../../../helpers/set-scroll-gradient'

import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'PvBoardGeneratorColumn' })

// refs
const columnContainer = ref(null)

console.log('PvBoardGeneratorColumn rendered')

// consts
const { initializeScrollGradient, removeScrollGradient } = setScrollGradient({
  styles: { gradientLevel: 2 }
})

// hooks
onMounted(() => initializeScrollGradient(columnContainer.value))
onBeforeUnmount(() => removeScrollGradient(columnContainer.value))
</script>
