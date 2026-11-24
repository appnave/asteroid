<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup>
import { useOverlayNavigation } from '../../composables'

import { computed } from 'vue'

defineOptions({ name: 'QasContainer' })

const props = defineProps({
  useSpaced: {
    type: Boolean,
    default: true
  },

  useBoundary: {
    type: Boolean,
    default: true
  }
})

// composables
const { isOverlay } = useOverlayNavigation()

// computeds
const classes = computed(() => {
  return {
    container: !isOverlay && props.useBoundary,
    spaced: props.useSpaced && !isOverlay && props.useBoundary
  }
})
</script>
