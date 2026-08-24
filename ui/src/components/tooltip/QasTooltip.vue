<template>
  <q-tooltip v-if="!isDragging" ref="tooltipRef" v-bind="tooltipProps" class="bg-grey-10 text-caption" @before-show="onBeforeShow" @hide="onHide">
    <qas-breakline :text="props.text" />
  </q-tooltip>
</template>

<script>
import { ref } from 'vue' // eslint-disable-line import/no-duplicates

// module-level: única instância compartilhada por todos os QasTooltip
export const activeTooltip = ref(null)
</script>

<script setup>
import QasBreakline from '../breakline/QasBreakline.vue'

import { inject, onUnmounted } from 'vue' // eslint-disable-line import/no-duplicates

defineOptions({ name: 'QasTooltip' })

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

const tooltipRef = ref(null)

// tooltip que este ocultou ao aparecer (ex.: o "pai" que o engloba)
let suppressed = null

// injects
const isDragging = inject('isDragging', ref(false))

// consts
const tooltipProps = {
  anchor: 'center right',
  self: 'center left',
  offset: [5, 5],
  maxWidth: '300px'
}

function onBeforeShow () {
  if (activeTooltip.value && activeTooltip.value !== tooltipRef.value) {
    suppressed = activeTooltip.value
    suppressed?.hide()
  }

  activeTooltip.value = tooltipRef.value
}

function onHide (evt) {
  if (activeTooltip.value === tooltipRef.value) {
    activeTooltip.value = null
  }

  // reexibe o tooltip que este ocultou, se o mouse voltou para dentro da âncora dele
  const previous = suppressed
  suppressed = null

  if (previous?.$el?.parentNode?.contains(evt?.relatedTarget)) {
    previous.show()
  }
}

onUnmounted(() => {
  if (activeTooltip.value === tooltipRef.value) {
    activeTooltip.value = null
  }
})
</script>
