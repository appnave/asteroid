<template>
  <q-icon v-bind="iconProps" aria-hidden="false" :aria-label="props.text" class="qas-tip">
    <qas-tooltip :text="props.text" />
  </q-icon>
</template>

<script setup>
import QasTooltip from '../tooltip/QasTooltip.vue'

import { computed } from 'vue'

defineOptions({ name: 'QasTip' })

const props = defineProps({
  text: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: 'sym_r_help'
  },

  size: {
    type: String,
    default: '16px'
  },

  color: {
    type: String,
    default: 'grey-8'
  }
})

// computeds
const iconProps = computed(() => {
  return {
    name: props.icon,
    size: props.size,
    color: props.color
  }
})
</script>

<style lang="scss">
.qas-tip {
  cursor: help;
}
</style>
