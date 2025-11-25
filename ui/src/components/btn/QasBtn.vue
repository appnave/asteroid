<template>
  <!-- "data-table-ignore-tr-hover" é para desabilitar o hover do tr no QasTableGenerator -->
  <q-btn ref="button" class="qas-btn" data-table-ignore-tr-hover v-bind="attributes">
    <template v-for="(_, name) in nonDefaultSlots" #[name]="context">
      <slot :name="name" v-bind="context || {}" />
    </template>

    <div class="items-center justify-between no-wrap row text-center" :class="containerClasses">
      <q-spinner v-if="hasLeftSpinner" :class="iconClasses" :size="spinnerSize" />

      <q-icon v-if="hasIcon" :class="iconClasses" :name="props.icon" />

      <div v-if="showLabel" :class="labelClasses">
        {{ props.label }}
      </div>

      <q-spinner v-if="hasRightSpinner" :class="iconRightClasses" :size="spinnerSize" />

      <q-icon v-if="hasIconRight" :class="iconRightClasses" :name="props.iconRight" />
    </div>

    <slot />

    <qas-tooltip v-if="hasTooltip" :text="tooltipText" />
  </q-btn>
</template>

<script setup>
import QasTooltip from '../tooltip/QasTooltip.vue'

import { useScreen } from '../../composables'

import { computed, useAttrs, useSlots, inject, isRef } from 'vue'

defineOptions({
  name: 'QasBtn',
  inheritAttrs: false
})

const props = defineProps({
  color: {
    default: undefined,
    type: String,
    validator: value => ['grey-10', 'primary', 'white', 'negative'].includes(value)
  },

  disable: {
    type: Boolean
  },

  disabledTooltip: {
    type: String,
    default: ''
  },

  icon: {
    default: undefined,
    type: String
  },

  iconRight: {
    default: undefined,
    type: String
  },

  size: {
    default: undefined,
    type: String,
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },

  useLabelOnSmallScreen: {
    default: true,
    type: Boolean
  },

  label: {
    default: '',
    type: String
  },

  loading: {
    type: Boolean
  },

  variant: {
    default: undefined,
    type: String,
    validator: value => {
      const variants = ['primary', 'secondary', 'tertiary']

      return variants.includes(value)
    }
  },

  tooltip: {
    type: String,
    default: ''
  },

  useEllipsis: {
    type: Boolean
  },

  useHoverOnWhiteColor: {
    default: true,
    type: Boolean
  }
})

// globals
const injectedDefaults = inject('btnPropsDefaults', {}) // Inject reativo ou não reativo com fallback vazio
const isInsideBox = inject('isBox', false)

// composables
const attrs = useAttrs()
const slots = useSlots()
const screen = useScreen()

// computeds
/**
 * Seta os valores padrões, dando prioridade:
 *  1. Props
 *  2. Injetado (pode ser reativo ou não reativo)
 *  3. Caso esteja dentro do QasBox, seta o size para 'sm' se for primary ou secondary.
 *  4. Hardcoded (tertiary, md, primary)
 */
const btnPropsDefaults = computed(() => {
  const defaultProps = isRef(injectedDefaults) ? injectedDefaults.value : injectedDefaults

  const isSmallVariant = ['primary', 'secondary'].includes(props.variant || defaultProps.variant)

  return {
    size: isInsideBox && isSmallVariant ? 'sm' : 'lg',
    variant: 'tertiary',
    color: 'primary',
    ...defaultProps
  }
})

const defaultSize = computed(() => props.size || btnPropsDefaults.value.size)
const defaultVariant = computed(() => props.variant || btnPropsDefaults.value.variant)
const defaultColor = computed(() => props.color || btnPropsDefaults.value.color)

// variantes
const isPrimary = computed(() => defaultVariant.value === 'primary')
const isSecondary = computed(() => defaultVariant.value === 'secondary')
const isTertiary = computed(() => defaultVariant.value === 'tertiary')

const showLabel = computed(() => props.useLabelOnSmallScreen || !screen.isSmall)

const hasIconOnly = computed(() => {
  return (
    (!props.label || !showLabel.value) &&
    ((props.icon && !props.iconRight) || (props.iconRight && !props.icon))
  )
})

const hasLeftSpinner = computed(() => props.loading && !props.iconRight)
const hasRightSpinner = computed(() => props.loading && props.iconRight)

const hasIconRight = computed(() => props.iconRight && !props.loading)
const hasIcon = computed(() => props.icon && !props.loading)

const labelClasses = computed(() => ({ ellipsis: props.useEllipsis }))
const containerClasses = computed(() => ({ 'full-width': props.useEllipsis }))

const iconClasses = computed(() => ({ 'on-left': !hasIconOnly.value }))
const iconRightClasses = computed(() => ({ 'on-right': !hasIconOnly.value }))

const classes = computed(() => {
  return [
    `qas-btn--${defaultSize.value}`,

    {
      'qas-btn--primary': isPrimary.value,
      'qas-btn--secondary': isSecondary.value,
      'qas-btn--tertiary': isTertiary.value,

      // color
      [`qas-btn--tertiary-${defaultColor.value}`]: isTertiary.value,
      [`qas-btn--primary-${defaultColor.value}`]: isPrimary.value,
      [`qas-btn--secondary-${defaultColor.value}`]: isSecondary.value,

      // icon
      'qas-btn--icon-only': hasIconOnly.value,
      'qas-btn--primary-icon-only': hasIconOnly.value && isPrimary.value,
      'qas-btn--secondary-icon-only': hasIconOnly.value && isSecondary.value,
      'qas-btn--tertiary-icon-only': hasIconOnly.value && isTertiary.value,

      // hover
      'qas-btn--no-hover-on-white': !props.useHoverOnWhiteColor,

      // loading
      'qas-btn--loading': props.loading,

      // ellipsis
      'full-width': props.useEllipsis
    }
  ]
})

const attributes = computed(() => {
  const {
    class: externalClass,
    dense,
    disable,
    fab,
    fabMini,
    flat,
    glossy,
    loading,
    noWrap,
    outline,
    padding,
    push,
    ripple,
    round,
    size,
    square,
    stack,
    stretch,
    textColor,
    unelevated,
    ...attributesPayload
  } = attrs

  return {
    ...attributesPayload,
    disable: props.disable || props.loading,
    class: [classes.value, externalClass]
  }
})

const nonDefaultSlots = computed(() => {
  const { default: _, ...nonDefaults } = slots

  return nonDefaults
})

const spinnerSize = computed(() => defaultSize.value === 'sm' ? 'xs' : 'sm')

// tooltips
const hasDisabledTooltip = computed(() => props.disable && props.disabledTooltip)
const hasTooltip = computed(() => props.tooltip || hasDisabledTooltip.value)
const tooltipText = computed(() => hasDisabledTooltip.value ? props.disabledTooltip : props.tooltip)
</script>
