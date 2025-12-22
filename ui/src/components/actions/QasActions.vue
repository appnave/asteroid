<template>
  <div class="q-mt-sm" :class="classes">
    <div v-if="hasTertiaryButton" :class="columnClasses">
      <slot name="tertiary">
        <qas-btn v-bind="formattedButtonsProps.tertiary" class="full-width" />
      </slot>
    </div>

    <div v-if="hasSecondaryButton" :class="columnClasses">
      <slot name="secondary">
        <qas-btn v-bind="formattedButtonsProps.secondary" class="full-width" />
      </slot>
    </div>

    <div v-if="hasPrimaryButton" :class="columnClasses">
      <slot name="primary">
        <qas-btn v-bind="formattedButtonsProps.primary" class="full-width" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import useScreen from '../../composables/use-screen'
import { FlexAlign } from '../../enums/Align'
import { Spacing } from '../../enums/Spacing'

import QasBtn from '../btn/QasBtn.vue'

import { computed, useSlots } from 'vue'

defineOptions({ name: 'QasActions' })

const props = defineProps({
  align: {
    default: FlexAlign.End,
    type: String,
    validator: value => Object.values(FlexAlign).includes(value)
  },

  gutter: {
    default: '',
    type: String,
    validator: value => !value || Object.values(Spacing).includes(value)
  },

  primaryButtonProps: {
    type: Object,
    default: () => ({})
  },

  secondaryButtonProps: {
    type: Object,
    default: () => ({})
  },

  tertiaryButtonProps: {
    type: Object,
    default: () => ({})
  },

  useFullWidth: {
    type: Boolean
  },

  useEqualWidth: {
    type: Boolean
  }
})

const slots = useSlots()
const screen = useScreen()

const defaultGutter = computed(() => {
  return props.gutter || (screen.isSmall ? 'md' : 'lg')
})

const classes = computed(() => {
  const isSmallOrFullWidth = screen.isSmall || props.useFullWidth

  return [
    !screen.isSmall && 'items-center',

    // alinhamento
    `justify-${props.align}`,

    // espaçamento
    `q-col-gutter-${defaultGutter.value}`,

    // disposição
    isSmallOrFullWidth ? 'column reverse' : 'row'
  ]
})

const columnClasses = computed(() => {
  if (props.useEqualWidth) return 'col-12 col-sm-6'

  return props.useFullWidth ? 'full-width' : 'col-12 col-sm-auto'
})

const hasPrimarySlot = computed(() => !!slots.primary)
const hasSecondarySlot = computed(() => !!slots.secondary)
const hasTertiarySlot = computed(() => !!slots.tertiary)

const hasPrimaryButton = computed(() => hasPrimarySlot.value || Object.keys(props.primaryButtonProps).length)
const hasSecondaryButton = computed(() => hasSecondarySlot.value || Object.keys(props.secondaryButtonProps).length)
const hasTertiaryButton = computed(() => hasTertiarySlot.value || Object.keys(props.tertiaryButtonProps).length)

const formattedButtonsProps = computed(() => {
  return {
    primary: { ...props.primaryButtonProps, variant: 'primary' },
    secondary: { ...props.secondaryButtonProps, variant: 'secondary' },
    tertiary: { ...props.tertiaryButtonProps, variant: 'tertiary' }
  }
})
</script>
