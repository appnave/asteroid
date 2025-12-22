<template>
  <component :is="props.typography" class="qas-label" :class="classes">
    <slot :label-with-suffix="formattedLabel">{{ formattedLabel }}</slot>
  </component>
</template>

<script setup>
import { Spacing } from '../../enums/Spacing'
import { addCounterSuffix, getRequiredLabel } from '../../helpers'

import { computed } from 'vue'

defineOptions({ name: 'QasLabel' })

const props = defineProps({
  color: {
    type: String,
    default: 'grey-10'
  },

  count: {
    default: 0,
    type: [Number, String]
  },

  label: {
    default: '',
    type: String
  },

  margin: {
    default: Spacing.Md,
    type: String,
    validator: value => Object.values(Spacing).includes(value)
  },

  required: {
    type: Boolean
  },

  typography: {
    default: 'h4',
    type: String,
    validator: value => ['h4', 'h5'].includes(value)
  }
})

const classes = computed(() => {
  return [
    `q-mb-${props.margin}`,
    `text-${props.color}`,
    `text-${props.typography}`
  ]
})

const labelWithSuffix = computed(() => addCounterSuffix(props.label, parseFloat(props.count)))

const formattedLabel = computed(() => {
  return getRequiredLabel({ label: labelWithSuffix.value, required: props.required })
})
</script>
