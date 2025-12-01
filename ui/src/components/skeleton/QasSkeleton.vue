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

  btnProps: {
    type: Object,
    default: () => ({
      iconOnly: false
    })
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

  useTitle: {
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
    QasCheckbox: {
      size: '18px'
    },

    QasBtn: {
      width: props.width || '24px',
      height: '24px'
    },

    QasStatus: {
      size: '16px',
      type: 'circle'
    }
  }

  const actionTypes = ['QasCheckbox', 'QasBtn']

  const classes = {
    [`qas-skeleton--${props.gutter}`]: !!props.gutter,
    'bg-blue-grey-4': props.useTitle || actionTypes.includes(props.type),
    'qas-skeleton--overlay': props.useOverlay
  }

  return {
    animation: 'blink',
    size: props.size,
    ...(props.type === 'text' && { type: 'text' }),
    class: [classes, attrs.class],
    width: props.width,
    ...defaultProps[props.type],
    height: props.height,
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
    // right: 0 !important;
    // left: 0 !important;
    bottom: 0 !important;
    position: absolute;

    &.qas-skeleton--sm {
      width: calc(100% - var(--qas-spacing-sm)) !important;
    }

    &.qas-skeleton--md {
      width: calc(100% - var(--qas-spacing-md)) !important;
    }

    &.qas-skeleton--lg {
      width: calc(100% - var(--qas-spacing-lg)) !important;
    }

    &.qas-skeleton--xl {
      width: calc(100% - var(--qas-spacing-xl)) !important;
    }
  }
}
</style>
