<template>
  <q-skeleton class="qas-skeleton" v-bind="skeletonProps" />
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'QasSkeleton', inheritAttrs: false })

const props = defineProps({
  gutter: {
    type: String,
    default: undefined
  },

  width: {
    type: String,
    default: undefined
  },

  height: {
    type: String,
    default: undefined
  },

  minHeight: {
    type: String,
    default: undefined
  },

  maxWidth: {
    type: String,
    default: undefined
  },

  size: {
    type: String,
    default: undefined
  },

  type: {
    type: String,
    default: undefined
  },

  useContrast: {
    type: Boolean
  },

  useOverlay: {
    type: Boolean
  }
})

// composables
const attrs = useAttrs()

// computeds
const skeletonProps = computed(() => {
  const defaultProps = {
    QasBadge: {
      width: props.width || '60px',
      height: props.height || '24px'
    },

    QasActionsMenu: {
      width: props.width || '80px',
      height: props.height || '24px'
    },

    QasCheckbox: {
      size: '18px'
    },

    QasBtn: {
      width: props.width || '130px',
      height: '24px'
    },

    QasToggleVisibility: {
      width: props.width || '140px'
    },

    QasTextTruncate: {
      width: props.width || '200px'
    },

    QasStatus: {
      size: '16px',
      type: 'circle'
    }
  }

  const actionTypes = [
    'QasCheckbox',
    'QasBtn',
    'QasToggleVisibility',
    'QasActionsMenu'
  ]

  const classes = {
    [`qas-skeleton--${props.gutter}`]: !!props.gutter,
    'bg-blue-grey-4': props.useContrast || actionTypes.includes(props.type),
    'qas-skeleton--overlay': props.useOverlay
  }

  return {
    animation: 'blink',
    size: props.size,
    ...(props.type === 'text' && { type: 'text' }),
    class: [classes, attrs.class],
    width: props.width,
    height: props.height,
    ...defaultProps[props.type],
    style: {
      ...(props.maxWidth && { maxWidth: props.maxWidth }),
      ...(props.minHeight && { minHeight: props.minHeight })
    }
  }
})
</script>

<style lang="scss">
.qas-skeleton {
  &--overlay {
    top: 0 !important;
    width: 100%;
    bottom: 0 !important;
    position: absolute;
  }
}
</style>
