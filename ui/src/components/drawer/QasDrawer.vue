<template>
  <qas-dialog v-model="model" class="qas-drawer" :class="containerDialogClasses" v-bind="attributes">
    <template #header>
      <slot name="header">
        <div class="items-center justify-between row">
          <span data-cy="drawer-title">
            <slot name="title">
              <h3 v-if="props.title" class="text-h3">
                {{ props.title }}
              </h3>
            </slot>
          </span>

          <qas-btn class="z-max" color="grey-10" data-cy="drawer-close-btn" icon="sym_r_close" variant="tertiary" @click="close" />
        </div>
      </slot>
    </template>

    <template #description>
      <div>
        <div class="relative-position" data-cy="drawer-default">
          <slot />
        </div>

        <div v-if="props.loading" class="qas-drawer__loading" :style="loadingStyle">
          <div class="full-height relative-position">
            <q-inner-loading :showing="props.loading">
              <q-spinner color="grey" size="2em" />
            </q-inner-loading>
          </div>
        </div>
      </div>
    </template>
  </qas-dialog>
</template>

<script setup>
import QasDialog from '../dialog/QasDialog.vue'
import QasBtn from '../btn/QasBtn.vue'

import useScreen from '../../composables/use-screen.js'

import { computed, inject } from 'vue'

defineOptions({
  name: 'QasDrawer',
  inheritAttrs: false
})

const props = defineProps({
  dialogProps: {
    type: Object,
    default: () => ({})
  },

  persistent: {
    type: Boolean
  },

  position: {
    type: String,
    default: 'left',
    validator: value => ['left', 'right'].includes(value)
  },

  title: {
    type: String,
    default: ''
  },

  loading: {
    type: Boolean
  },

  size: {
    type: String,
    default: 'sm',
    validator: value => !value || ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const isOverlay = inject('isOverlay', false)

// emits
const model = defineModel({ type: Boolean })

// composables
const screen = useScreen()

// computed
const containerDialogClasses = computed(() => {
  if (isOverlay) return 'qas-drawer--overlay'

  return screen.isSmall ? 'qas-drawer--mobile' : `qas-drawer--${props.size}`
})

const loadingStyle = computed(() => {
  const sizesWidth = {
    sm: '450px',
    md: '800px',
    lg: '1000px',
    xl: '1200px'
  }

  return screen.isSmall ? '95%' : sizesWidth[props.size]
})

const attributes = computed(() => {
  return {
    ...props.dialogProps,

    title: props.title,
    cancel: false,
    maximized: true,
    ok: false,
    position: props.position,
    persistent: props.persistent
  }
})

// functions
function close () {
  model.value = false
}
</script>

<style lang="scss">
.qas-drawer {
  &__loading {
    height: 100vh;
    left: 0;
    position: absolute;
    top: 0;
  }

  &--mobile {
    .qas-dialog__container {
      max-width: 450px !important;
    }
  }

  &--overlay {
    .qas-dialog__container {
      max-width: 90% !important;
    }
  }

  &--sm {
    .qas-dialog__container {
      max-width: 368px !important;
    }
  }

  &--md {
    .qas-dialog__container {
      max-width: 512px !important;
    }
  }

  &--lg {
    .qas-dialog__container {
      max-width: 656px !important;
    }
  }

  &--xl {
    .qas-dialog__container {
      max-width: 800px !important;
    }
  }
}
</style>
