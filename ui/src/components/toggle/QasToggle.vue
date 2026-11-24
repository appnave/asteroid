<template>
  <div class="row">
    <span v-if="props.title" class="col-12 q-mb-xs text-caption">
      {{ props.title }}
    </span>

    <q-toggle class="col-12 qas-toggle" v-bind="toggleAttrs" dense>
      <template v-if="hasLabelTip" #default>
        <div class="items-center no-wrap q-gutter-x-xs row">
          <div>
            {{ attrs.label }}
          </div>

          <qas-tip :text="props.tip" />
        </div>
      </template>
    </q-toggle>
  </div>
</template>

<script setup>
import QasTip from '../tip/QasTip.vue'

import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'QasToggle',
  inheritAttrs: false
})

const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  tip: {
    type: String,
    default: ''
  }
})

// composables
const attrs = useAttrs()

const hasLabelTip = computed(() => !!(props.tip && attrs.label))

const toggleAttrs = computed(() => {
  const payload = { ...attrs }

  if (hasLabelTip.value) {
    payload.label = undefined
  }

  return payload
})
</script>

<style lang="scss">
.qas-toggle {
  &.q-toggle {
    .q-toggle__label {
      @include set-typography($body1);

      padding-left: var(--qas-spacing-sm) !important;
    }

    &.disabled {
      opacity: 1 !important;

      .q-toggle__inner,
      .q-toggle__label {
        color: $grey-6;
      }

      .q-toggle__thumb::after {
        background-color: $grey-6;
      }
    }
  }
}
</style>
