<template>
  <component :is="props.tag" v-for="(line, index) in lines" :key="index" v-bind="attrs">
    {{ line }}
  </component>
</template>

<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import { getSlotChildrenText } from '../../helpers'

defineOptions({ name: 'QasBreakline' })

const props = defineProps({
  split: {
    default: '\n',
    type: String
  },

  tag: {
    default: 'div',
    type: String
  },

  text: {
    default: '',
    type: String
  }
})

const attrs = useAttrs()
const slots = useSlots()

const lines = computed(() => {
  const text = props.text || (slots.default ? getSlotChildrenText(slots.default()) : '')

  return text.split(props.split)
})
</script>
