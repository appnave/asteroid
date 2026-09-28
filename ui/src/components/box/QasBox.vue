<template>
  <div class="bg-white qas-box rounded-borders" :class="boxClasses">
    <div ref="content" class="relative-position">
      <slot />

      <qas-skeleton v-if="props.skeleton" use-overlay />
    </div>
  </div>
</template>

<script setup>
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { Spacing } from '../../enums/Spacing'
import { useOverlayNavigation } from '../../composables'

import { computed, provide, ref } from 'vue'

defineOptions({ name: 'QasBox' })

const props = defineProps({
  outlined: {
    type: Boolean,
    default: undefined
  },

  unelevated: {
    type: Boolean,
    default: undefined
  },

  skeleton: {
    type: Boolean
  },

  spacingX: {
    default: Spacing.Md,
    type: String,
    validator: value => Object.values(Spacing).includes(value)
  },

  spacingY: {
    default: Spacing.Md,
    type: String,
    validator: value => Object.values(Spacing).includes(value)
  },

  useSpacing: {
    type: Boolean,
    default: true
  }
})

// globals
provide('isBox', true)

// composables
const { isOverlay } = useOverlayNavigation()

// template refs
const content = ref(null)

// computed
const defaultOutlined = computed(() => props.outlined ?? isOverlay)
const defaultUnelevated = computed(() => props.unelevated ?? isOverlay)

const boxClasses = computed(() => {
  return {
    'border-grey': defaultOutlined.value,
    'shadow-2': !defaultUnelevated.value,
    [`q-px-${props.spacingX}`]: props.useSpacing,
    [`q-py-${props.spacingY}`]: props.useSpacing
  }
})
</script>
