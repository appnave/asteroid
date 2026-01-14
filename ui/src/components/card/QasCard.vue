<template>
  <div class="qas-card">
    <qas-box :class="boxClasses" v-bind="boxProps">
      <q-card class="column full-height overflow-hidden shadow-0">
        <header v-if="hasHeader" class="full-width items-center justify-between no-wrap q-mb-sm row">
          <slot name="header">
            <div class="ellipsis flex full-width no-wrap">
              <slot v-if="props.useSelection" name="header-left">
                <qas-skeleton v-if="props.skeleton" class="q-mr-sm" type="QasCheckbox" />

                <qas-checkbox v-else v-model="selected" :false-value="props.falseValue" :true-value="props.trueValue" />
              </slot>

              <component :is="titleComponent.is" class="ellipsis full-width text-h5 text-no-decoration" v-bind="titleComponent.props">
                <qas-skeleton v-if="props.skeleton" type="text" use-contrast />

                <span v-else>
                  <slot name="title">
                    {{ props.title }}
                  </slot>

                  <qas-tooltip v-if="props.tooltip" :text="props.tooltip" />
                </span>
              </component>
            </div>

            <div v-if="hasActions">
              <qas-skeleton v-if="props.skeleton" class="q-ml-sm" type="QasBtn" />

              <qas-actions-menu v-else v-bind="formattedActionsMenuProps" />
            </div>
          </slot>
        </header>

        <div class="qas-card__content relative-position" :class="contentClasses">
          <qas-skeleton v-if="props.skeleton" use-overlay />

          <slot name="default" />
        </div>

        <div class="q-mt-auto">
          <q-separator v-if="hasFooter" class="q-mb-sm" />

          <div v-if="hasExpansion" class="div">
            <div v-if="props.skeleton" class="flex justify-between">
              <qas-skeleton type="text" use-contrast width="150px" />

              <qas-skeleton size="24px" type="QasBtn" />
            </div>

            <slot v-else name="footer">
              <q-expansion-item v-if="hasExpansion" class="full-width" dense expand-icon-class="text-primary" header-class="q-pa-none text-primary" :label="props.expansionProps.label">
                <slot name="expansion-content">
                  {{ props.expansionProps.content }}
                </slot>
              </q-expansion-item>
            </slot>
          </div>
        </div>
      </q-card>
    </qas-box>
  </div>
</template>

<script setup>
import QasTooltip from '../tooltip/QasTooltip.vue'
import QasActionsMenu from '../actions-menu/QasActionsMenu.vue'
import QasCheckbox from '../checkbox/QasCheckbox.vue'
import QasBox from '../box/QasBox.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { computed, useSlots, inject } from 'vue'
import { colors } from 'quasar'

defineOptions({ name: 'QasCard' })

const props = defineProps({
  actionsMenuProps: {
    type: Object,
    default: () => ({})
  },

  expansionProps: {
    type: Object,
    default: () => ({})
  },

  falseValue: {
    type: [Boolean, String, Number, Array, Object],
    default: false
  },

  skeleton: {
    type: Boolean
  },

  route: {
    type: Object,
    default: () => ({})
  },

  statusColor: {
    type: String,
    default: ''
  },

  title: {
    type: String,
    default: ''
  },

  tooltip: {
    type: String,
    default: ''
  },

  trueValue: {
    type: [Boolean, String, Number, Array, Object],
    default: true
  },

  useSelection: {
    type: Boolean
  }
})

// models
const selected = defineModel('selected', { type: [Boolean, String, Number, Array, Object], default: false })

// consts
const isInsideBox = inject('isBox', false)
const isInsideDialog = inject('isDialog', false)

// composables
const slots = useSlots()

// computeds
/**
 * Quando o card está dentro de um box ou dialog, ele terá bordas ao invés da box.
 */
const boxProps = computed(() => {
  const useBorder = isInsideBox || isInsideDialog

  return {
    outlined: useBorder,
    unelevated: useBorder,

    // Terá o padding vertical menor se for um card com status ou tiver o expansion.
    spacingY: (props.statusColor || hasExpansion.value) ? 'sm' : 'md',
    style: style.value
  }
})

const hasActions = computed(() => !!Object.keys(props.actionsMenuProps).length)

const hasExpansion = computed(() => !!Object.keys(props.expansionProps).length)

const contentClasses = computed(() => hasFooter.value && 'q-mb-sm')

const boxClasses = computed(() => props.statusColor ? 'rounded-borders-right' : 'rounded-borders')

const titleComponent = computed(() => {
  const hasRoute = !!Object.keys(props.route).length && !props.skeleton

  return {
    is: hasRoute ? 'router-link' : 'h5',
    props: {
      ...(hasRoute && {
        to: props.route,
        class: 'qas-card__router'
      })
    }
  }
})

const style = computed(() => {
  if (!props.statusColor) return

  const { getPaletteColor, lighten } = colors

  const palletColor = getPaletteColor('blue-2')

  return {
    backgroundImage: `linear-gradient(270deg, ${lighten(palletColor, 62)} 0%, #FFFFFF 60%) !important`,
    borderLeft: `4px solid ${palletColor} !important`
  }
})

const hasFooterSlot = computed(() => !!slots.footer)

const hasHeader = computed(() => {
  const hasHeaderSlot = !!slots.header
  const hasTitleSlot = !!slots.title

  return hasHeaderSlot || hasTitleSlot || !!props.title
})

const hasFooter = computed(() => hasFooterSlot.value || hasExpansion.value)

const formattedActionsMenuProps = computed(() => {
  return {
    ...props.actionsMenuProps,
    useLabel: false
  }
})
</script>

<style lang="scss">
.qas-card {
  &__content {
    max-width: 100%;
  }

  .q-card {
    background-color: transparent;
  }

  &__router {
    &:hover {
      color: $primary;
    }
  }
}
</style>
