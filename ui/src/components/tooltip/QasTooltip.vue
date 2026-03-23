<template>
  <q-tooltip v-if="!isDragging" v-bind="tooltipProps" class="bg-grey-10 text-caption">
    <qas-breakline :text="props.text" />
  </q-tooltip>
</template>

<script setup>
import QasBreakline from '../breakline/QasBreakline.vue'

import { inject, ref } from 'vue'

defineOptions({ name: 'QasTooltip' })

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

// injects
const isDragging = inject('isDragging', ref(false))

// consts
const tooltipProps = {
  anchor: 'center right',
  self: 'center left',
  offset: [5, 5],
  maxWidth: '300px'
}
</script>
