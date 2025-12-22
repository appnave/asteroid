<template>
  <div class="col-12 col-lg-3 col-md-4 col-sm-6">
    <q-card class="border-radius-lg column full-height overflow-hidden" :class="cardClasses">
      <header v-if="props.useHeader" class="full-width overflow-hidden relative-position">
        <slot name="header">
          <q-carousel v-model="slideImage" animated class="cursor-pointer" height="205px" infinite :navigation="hasImages" navigation-icon="sym_r_fiber_manual_record" swipeable>
            <template #navigation-icon="{ active, btnProps, onClick }">
              <qas-btn color="white" :icon="getNavigationIcon(active, btnProps)" variant="tertiary" @click="onClick" />
            </template>

            <q-carousel-slide v-for="(item, index) in imagesList" :key="index" class="bg-no-repeat" :class="imagePositionClass" :img-src="item" :name="index" />
          </q-carousel>

          <div class="absolute-top flex items-center q-pa-md">
            <slot name="carousel-header" />
          </div>
        </slot>
      </header>

      <q-card-section class="col-grow column full-width justify-between">
        <div class="full-width" :class="gutterClass">
          <slot />
        </div>
      </q-card-section>

      <div v-if="hasActionsSlot" class="border-grey border-top overflow-hidden row">
        <slot name="actions" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'

import { Spacing } from '../../enums/Spacing'

import { ref, computed, useSlots } from 'vue'

defineOptions({ name: 'QasCardImage' })

const props = defineProps({
  imagePosition: {
    type: String,
    default: 'center'
  },

  gutter: {
    type: String,
    default: Spacing.Sm,
    validator: value => Object.values(Spacing).includes(value)
  },

  images: {
    default: () => [],
    type: Array
  },

  outlined: {
    type: Boolean
  },

  unelevated: {
    type: Boolean
  },

  useHeader: {
    type: Boolean
  }
})

const slots = useSlots()

const slideImage = ref(0)

const cardClasses = computed(() => {
  return {
    'shadow-2': !props.unelevated,
    'border-primary': props.outlined,
    'no-shadow': props.outlined,
    'bg-white': props.outlined
  }
})

const imagePositionClass = computed(() => `bg-position-${props.imagePosition}`)
const gutterClass = computed(() => `q-col-gutter-${props.gutter}`)

const hasActionsSlot = computed(() => !!slots.actions)
const hasImages = computed(() => props.images.length > 1)

const imagesLength = computed(() => props.images?.length)
const imagesList = computed(() => imagesLength.value && props.images.slice(0, 3))

function getNavigationIcon (active, { icon }) {
  return active ? 'sym_r_radio_button_checked' : icon
}
</script>
