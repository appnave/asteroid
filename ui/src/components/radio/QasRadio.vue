<template>
  <div class="qas-radio">
    <qas-label v-if="canShowOptionGroupLabel" :color :label="props.label" margin="sm" typography="h5" />

    <component :is="component.is" v-bind="component.props" />

    <qas-error-message v-if="props.errorMessage" :message="props.errorMessage" />
  </div>
</template>

<script setup>
import QasLabel from '../label/QasLabel.vue'
import QasErrorMessage from '../error-message/QasErrorMessage.vue'

import useErrorMessage, { baseErrorProps } from '../../composables/private/use-error-message'
import useScreen from '../../composables/use-screen'

import { QRadio, QOptionGroup } from 'quasar'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'QasRadio',
  inheritAttrs: false
})

const props = defineProps({
  ...baseErrorProps,

  label: {
    default: '',
    type: String
  }
})

// globals
const attrs = useAttrs()

// composables
const { color } = useErrorMessage(props)
const screen = useScreen()

// computeds
const isOptionGroup = computed(() => !!attrs.options?.length)

/**
 * Só mostra a label caso for q-option-group e tenha label vindo nas props
 */
const canShowOptionGroupLabel = computed(() => isOptionGroup.value && !!props.label)

/**
 * - quando é um grupo de opções, o componente é 'QOptionGroup', caso contrário,
 * é 'QRadio'.
 * - a propriedade inline só é usada no caso do QOptionGroup.
 * - todos os casos é usado o dense.
 */
const component = computed(() => {
  const isInline = !screen.isSmall

  const { ...payloadProps } = attrs

  return {
    is: isOptionGroup.value ? QOptionGroup : QRadio,

    props: {
      ...payloadProps,
      label: props.label,

      ...(isOptionGroup.value && {
        inline: isInline,
        class: {
          flex: true,
          'q-gutter-md': true,
          column: !isInline
        }
      }),

      dense: true
    }
  }
})
</script>

<style lang="scss">
.qas-radio {
  .q-radio {
    &__label {
      @include set-typography($body1);

      padding-left: var(--qas-spacing-sm) !important;
    }

    &__inner {
      width: 18px;
      height: 18px;
      min-width: 18px;

      &::before {
        color: $primary;
      }
    }

    &.disabled {
      opacity: 1 !important;

      .q-radio__label,
      .q-radio__inner {
        color: $grey-6;
      }
    }
  }
}
</style>
