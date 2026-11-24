<template>
  <!-- "data-table-ignore-hover" é para não habilitar hover no texto no QasTableGenerator -->
  <component :is="component.is" v-bind="component.props" class="q-px-sm qas-badge text-body2" :class="componentClasses" data-table-ignore-hover :style="componentStyle">
    <slot>
      <div class="items-center no-wrap q-gutter-xs row">
        <q-icon v-if="showIcon" :color="props.color" :name="props.icon" />

        <div>
          {{ props.label }}
        </div>
      </div>
    </slot>
  </component>
</template>

<script setup>
import { QChip, QBadge, colors } from 'quasar'

import { baseProps } from '../../shared/badge-config'

import { computed } from 'vue'

defineOptions({
  name: 'QasBadge',
  inheritAttrs: false
})

// props
const props = defineProps(baseProps)

// emits
const emit = defineEmits(['remove'])

// models
const model = defineModel({ type: Boolean, default: true })

// consts
const { getPaletteColor, hexToRgb } = colors

// computeds
const component = computed(() => {
  const isChip = props.removable

  return {
    is: isChip ? QChip : QBadge,
    props: {
      // comum
      color: props.useSubtle ? undefined : props.color,
      dense: true,
      textColor: props.textColor,

      // somente QChip
      ...(isChip && {
        iconRemove: 'sym_r_close',
        removable: true,
        square: true,
        tabindex: props.tabindex,
        modelValue: model.value,
        ripple: false,
        onRemove: () => emit('remove')
      }),

      // somente QBadge
      ...(!isChip && {
        multiLine: props.multiLine,
        ariaMultiline: props.multiLine
      })
    }
  }
})

const componentClasses = computed(() => {
  if (!props.useSubtle) return {}

  return {
    'q-chip--subtle': props.removable,
    'q-badge--subtle': !props.removable
  }
})

const componentStyle = computed(() => {
  if (!props.useSubtle) return {}

  const colorHex = getPaletteColor(props.color)
  const { r, g, b } = hexToRgb(colorHex)

  return {
    '--qas-badge-subtle-bg': `rgba(${r}, ${g}, ${b}, 0.1)`,
    '--qas-badge-subtle-border': `rgba(${r}, ${g}, ${b}, 0.5)`
  }
})

/**
 * O icone só é exibido quando o badge é do tipo "subtle" e quando a prop "icon" é informada.
 */
const showIcon = computed(() => props.icon && props.useSubtle)
</script>

<style lang="scss">
.qas-badge {
  min-height: 20px;
  padding-bottom: 2px;
  padding-top: 2px;

  &.q-chip--subtle,
  &.q-badge--subtle {
    background-color: var(--qas-badge-subtle-bg) !important;
    border-color: var(--qas-badge-subtle-border) !important;
    border-radius: $generic-border-radius;
    border-style: solid;
    border-width: 1px;
  }
}
</style>
