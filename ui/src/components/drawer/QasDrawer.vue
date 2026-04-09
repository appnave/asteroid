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

import { computed } from 'vue'

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

// emits
const model = defineModel({ type: Boolean })

// composables
const screen = useScreen()

// computed
const containerDialogClasses = computed(() => {
  return screen.isSmall
    ? 'qas-drawer--mobile'
    : `qas-drawer--${props.size}`
})

const loadingStyle = computed(() => {
  const sizesWidth = {
    sm: '20%',
    md: '50%',
    lg: '70%',
    xl: '90%'
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
    position: props.position
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
      max-width: 95% !important;
    }
  }

  &--sm {
    .qas-dialog__container {
      max-width: 20% !important;
    }
  }

  &--md {
    .qas-dialog__container {
      max-width: 50% !important;
    }
  }

  &--lg {
    .qas-dialog__container {
      max-width: 70% !important;
    }
  }

  &--xl {
    .qas-dialog__container {
      max-width: 90% !important;
    }
  }
}
</style>
