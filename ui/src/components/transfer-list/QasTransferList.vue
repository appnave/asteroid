<template>
  <div
    class="full-width"
    :class="containerClasses"
  >
    <div :class="boxContainerClasses">
      <qas-box
        outlined
        unelevated
      >
        <div
          v-for="(item, itemIndex) in props.from"
          :key="itemIndex"
        >
          <slot
            :item="item"
            name="from-column"
          />

          <q-separator
            v-if="!isLastItem(props.from, itemIndex)"
            class="q-my-md"
          />
        </div>
      </qas-box>
    </div>

    <div class="col-12 col-md-1 col-sm-1 text-center">
      <q-icon
        class="q-py-md text-grey-8"
        :name="iconValue"
        size="sm"
      />
    </div>

    <div :class="boxContainerClasses">
      <qas-box
        outlined
        unelevated
      >
        <div
          v-for="(item, itemIndex) in props.to"
          :key="itemIndex"
        >
          <slot
            :item="item"
            name="to-column"
          />

          <q-separator
            v-if="!isLastItem(props.to, itemIndex)"
            class="q-my-md"
          />
        </div>
      </qas-box>
    </div>
  </div>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'

import { computed } from 'vue'

import useScreen from '../../composables/use-screen'

defineOptions({ name: 'QasTransferList' })

const props = defineProps({
  from: {
    type: Array,
    default: () => []
  },

  to: {
    type: Array,
    default: () => []
  }
})

// composables
const screen = useScreen()

// computeds
const containerClasses = computed(() => {
  return screen.untilLarge ? 'column' : 'row items-center no-wrap'
})

const boxContainerClasses = computed(() => {
  return screen.untilLarge ? 'col-12' : 'col'
})

const iconValue = computed(() => {
  return screen.untilLarge ? 'sym_r_arrow_downward' : 'sym_r_arrow_right_alt'
})

// functions
function isLastItem (list, index) {
  return index === list.length - 1
}
</script>
