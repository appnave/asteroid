<template>
  <div :class="classes.container">
    <header :class="classes.header">
      <slot name="header">
        <div v-bind="textAttributes">
          {{ props.label }}
        </div>
      </slot>

      <qas-tip v-if="props.tip" class="q-ml-xs" :text="props.tip" />
    </header>

    <div v-bind="contentProps">
      <slot name="content">
        {{ props.value }}
      </slot>
    </div>
  </div>
</template>

<script setup>
import QasTip from '../tip/QasTip.vue'
import { useScreen } from '../../composables'

import { computed } from 'vue'

defineOptions({ name: 'QasGridItem' })

const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  useEllipsis: {
    default: true,
    type: Boolean
  },

  useInline: {
    type: Boolean
  },

  value: {
    type: [String, Number, Boolean],
    default: ''
  },

  tip: {
    type: String,
    default: ''
  },

  content: {
    type: Object,
    default: () => ({})
  }
})

const screen = useScreen()

// computed
const hasEllipsis = computed(() => props.useEllipsis && !screen.isSmall)

const classes = computed(() => {
  const isInline = props.useInline && !screen.isSmall

  const { typography } = props.content

  return {
    container: {
      'flex justify-between col-12 no-wrap': isInline
    },

    header: {
      'text-caption': !isInline,

      /**
       * Necessário adicionar o padding à direita no header ao invés do gutter, pois ao usar o gutter no eixo x,
       * ele adiciona um espaçamento à direita do content de forma errada, deixando o espaçamento maior que o do header.
       */
      'text-body1 q-pr-md': isInline,

      // classes por conta do tip.
      'row no-wrap': props.tip,
      'items-center': props.tip || typography,
      flex: typography
    },

    content: {
      'text-grey-10': true,

      // é possível passar uma tipografia personalizada.
      [`text-${typography}`]: typography,

      'text-body1': !isInline && !typography,
      'text-subtitle1': isInline && !typography,

      ellipsis: hasEllipsis.value
    }
  }
})

const contentProps = computed(() => {
  return {
    class: classes.value.content,
    ...(hasEllipsis.value && { title: props.value })
  }
})

const textAttributes = computed(() => {
  return hasEllipsis.value ? { title: props.label } : undefined
})
</script>
