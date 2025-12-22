<template>
  <div ref="expansionItem" class="full-width qas-expansion-item" :class="classes" v-bind="expansionProps.parent">
    <qas-box class="qas-expansion-item__box" v-bind="boxProps">
      <q-expansion-item v-model="modelValue" v-bind="expansionProps.item" header-class="text-bold q-mt-sm q-pa-none qas-expansion-item__header" @show="setShowContent">
        <template #header>
          <div class="full-width justify-between no-wrap row">
            <div class="full-width">
              <slot name="header">
                <div class="items-center q-col-gutter-sm row">
                  <slot name="header-label">
                    <qas-label class="col-auto qas-expansion-item__label" :label="props.label" margin="none" typography="h5" />
                  </slot>

                  <div v-if="hasBadges" class="col-auto items-center q-col-gutter-sm row">
                    <div v-for="(badge, badgeIndex) in props.badges" :key="badgeIndex" class="col-auto">
                      <qas-badge v-bind="badge" />
                    </div>
                  </div>
                </div>

                <div v-if="hasHeaderBottom" class="q-mt-sm">
                  <slot name="header-bottom" />
                </div>
              </slot>
            </div>

            <qas-btn class="qas-expansion-item__dropdown" color="grey-10" :disable="isDisabled" icon="sym_r_keyboard_arrow_down" />
          </div>
        </template>

        <div :class="contentClasses">
          <slot v-if="showContent" name="content">
            <qas-grid-generator v-if="hasGridGenerator" use-inline v-bind="gridGeneratorProps" />
          </slot>
        </div>
      </q-expansion-item>
    </qas-box>

    <qas-error-message v-if="hasError" :message="props.errorMessage" />
  </div>
</template>

<script setup>
import QasBadge from '../badge/QasBadge.vue'
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasErrorMessage from '../error-message/QasErrorMessage.vue'
import QasGridGenerator from '../grid-generator/QasGridGenerator.vue'
import QasLabel from '../label/QasLabel.vue'

import { baseErrorProps } from '../../composables/private/use-error-message'

import { computed, provide, inject, ref, useAttrs } from 'vue'

defineOptions({
  name: 'QasExpansionItem',
  inheritAttrs: false
})

const props = defineProps({
  ...baseErrorProps,

  badges: {
    type: Array,
    default: () => []
  },

  disable: {
    type: Boolean
  },

  disableButton: {
    type: Boolean
  },

  gridGeneratorProps: {
    type: Object,
    default: () => ({})
  },

  group: {
    type: String,
    default: undefined
  },

  label: {
    type: String,
    default: ''
  },

  maxContentHeight: {
    type: String,
    default: ''
  }
})

const modelValue = defineModel({ type: Boolean })

const attrs = useAttrs()

provide('isExpansionItem', true)

// slots
const slots = defineSlots()

// refs
const expansionItem = ref(null)
const showContent = ref(false)

// consts
// TODO-ISSUE: rever quando a issue #1377 para ter um inject geral for resolvida.
const isNestedExpansionItem = inject('isExpansionItem', false)
const isNestedBox = inject('isBox', false)
const isDialog = inject('isDialog', false)

// computed
const hasBadges = computed(() => !!props.badges.length)
const hasError = computed(() => props.error || !!props.errorMessage)
const hasGridGenerator = computed(() => !!Object.keys(props.gridGeneratorProps).length)
const hasHeaderBottom = computed(() => !!slots['header-bottom'])

const classes = computed(() => {
  return {
    'qas-expansion-item--error': hasError.value,
    'qas-expansion-item--disabled': props.disable || props.disableButton,
    'qas-expansion-item--disabled-full': props.disable
  }
})

const contentClasses = computed(() => {
  return {
    'q-mt-md': true,
    'qas-expansion-item__content overflow-auto': !!props.maxContentHeight
  }
})

const expansionProps = computed(() => {
  const {
    'onUpdate:modelValue': onUpdateModelValue,
    onShow,
    onBeforeShow,
    onBeforeHide,
    onAfterShow,
    onAfterHide,
    ...propsPayload
  } = attrs

  return {
    parent: propsPayload,

    item: {
      disable: isDisabled.value,
      hideExpandIcon: true,
      label: props.label,
      group: props.group,

      // events
      onUpdateModelValue,
      onShow,
      onBeforeShow,
      onBeforeHide,
      onAfterShow,
      onAfterHide
    }
  }
})

const boxProps = computed(() => {
  /**
   * Caso o QasExpansionItem estiver dentro de um QasBox, QasDialog ou for um QasExpansionItem
   * dentro de outro QasExpansionItem, o componente terá uma borda.
  */
  const isBoxed = isNestedBox || isNestedExpansionItem || isDialog

  if (!isBoxed) return {}

  return {
    unelevated: isBoxed,
    outlined: isBoxed
  }
})

const isDisabled = computed(() => props.disable || props.disableButton)

// functions
function setShowContent () {
  showContent.value = true
}
</script>

<style lang="scss">
.qas-expansion-item {
  $root: &;

  &--disabled {
    .q-item.disabled {
      opacity: 1 !important;
    }
  }

  &--disabled-full {
    #{$root}__label {
      color: $grey-6 !important;
    }
  }

  &--error {
    #{$root}__header {
      color: $negative;

      .qas-label,
      .qas-btn {
        color: $negative !important;
      }
    }

    #{$root}__box {
      border: 1px solid $negative !important;
    }
  }

  &__content {
    max-height: v-bind("props.maxContentHeight");
  }

  // em alguns casos quando usado com grid, o espaçamento afetava o header, com z-index o problema é resolvido
  &__header {
    position: relative;
    z-index: 1;
  }

  .q-expansion-item {
    #{$root}__dropdown {
      transition: transform var(--qas-generic-transition);;
    }

    &--expanded {
      #{$root}__dropdown {
        transform: rotate(180deg);
      }
    }

    &--collapsed {
      #{$root}__dropdown {
        transform: none;
      }
    }
  }

  .q-item {
    margin-top: 0;
    min-height: auto;
  }

  .q-item:hover {
    color: initial !important;
  }
}
</style>
