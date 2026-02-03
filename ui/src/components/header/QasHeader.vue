<template>
  <div v-if="hasHeaderContent" :class="containerClasses">
    <div v-if="hasLabelSection" class="full-width items-center justify-between no-wrap row" :class="labelSectionClasses">
      <div class="items-center overflow-hidden q-col-gutter-sm row">
        <div v-if="props.skeleton">
          <qas-skeleton type="text" use-contrast width="200px" />
        </div>

        <slot v-else name="label">
          <div v-if="hasLabel" class="items-center q-gutter-x-sm row">
            <qas-label v-if="hasLabel" v-bind="defaultLabelProps" />

            <qas-tip v-if="hasTip" v-bind="defaultTipProps" />
          </div>
        </slot>

        <div v-if="hasBadges" class="col-auto items-center q-col-gutter-sm row">
          <div v-for="(badge, badgeIndex) in props.badges" :key="badgeIndex">
            <qas-skeleton v-if="props.skeleton" type="QasBadge" />

            <qas-badge v-else v-bind="badge" />
          </div>
        </div>
      </div>

      <div v-if="hasActionsSection" class="text-right">
        <slot name="actions">
          <component :is="actionsComponent.is" v-if="hasActionsComponent" v-bind="actionsComponent.props" />
        </slot>
      </div>
    </div>

    <div v-if="hasDescriptionOrOnlyActionsSection" class="items-start no-wrap q-col-gutter-sm row" :class="descriptionSectionClasses">
      <div v-if="hasDescriptionSection" class="text-body1 text-grey-8" :class="descriptionClasses">
        <qas-skeleton v-if="props.skeleton" max-width="400px" type="text" />

        <slot v-else name="description">
          {{ props.description }}
        </slot>
      </div>

      <div v-if="!hasLabelSection" class="justify-end row text-right">
        <qas-skeleton v-if="props.skeleton" type="QasBtn" />

        <slot v-else name="actions">
          <component :is="actionsComponent.is" v-if="hasActionsComponent" v-bind="actionsComponent.props" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import QasLabel from '../label/QasLabel.vue'
import QasBadge from '../badge/QasBadge.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasActionsMenu from '../actions-menu/QasActionsMenu.vue'
import QasFilters from '../filters/QasFilters.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'
import QasTip from '../tip/QasTip.vue'

import { Spacing } from '../../enums/Spacing'
import { gutterValidator } from '../../helpers/private/gutter-validator'

import { computed, useSlots, provide } from 'vue'

defineOptions({ name: 'QasHeader' })

const props = defineProps({
  actionsMenuProps: {
    type: Object,
    default: () => ({})
  },

  badges: {
    type: Array,
    default: () => []
  },

  buttonProps: {
    default: () => ({}),
    type: Object
  },

  description: {
    type: String,
    default: ''
  },

  filtersProps: {
    default: () => ({}),
    type: Object
  },

  labelProps: {
    type: Object,
    default: () => ({})
  },

  skeleton: {
    type: Boolean
  },

  spacing: {
    default: Spacing.Md,
    type: String,
    validator: gutterValidator
  },

  tipProps: {
    type: Object,
    default: () => ({})
  },

  useEllipsis: {
    type: Boolean
  }
})

// globals
provide('isHeader', true)

const slots = useSlots()

// computed
const containerClasses = computed(() => `q-mb-${props.spacing}`)

const labelSectionClasses = computed(() => {
  return {
    'q-mb-xs': hasBadges.value
  }
})

const descriptionSectionClasses = computed(() => {
  return {
    'justify-between': hasDescriptionSection.value,
    'justify-end': hasActionsSection.value && !hasDescriptionSection.value
  }
})

/**
 * É necessário adicionar full-width na descrição quando tem skeleton pois o skeleton
 * precisa ter max-width, e para width funcionar corretamente, o pai precisa ser full-width.
 * Se sempre deixar como full-width, quebra layout quando tem descrição com ação sem label.
 */
const descriptionClasses = computed(() => {
  return {
    'full-width': props.skeleton
  }
})

const defaultLabelProps = computed(() => {
  return {
    class: {
      ellipsis: props.useEllipsis
    },

    margin: 'none',
    ...props.labelProps
  }
})

const hasTip = computed(() => !!Object.keys(props.tipProps).length)

const defaultTipProps = computed(() => {
  return {
    size: '20px',
    ...props.tipProps
  }
})

const actionsComponent = computed(() => {
  const component = {
    [hasDefaultButton.value]: {
      is: QasBtn,
      props: {
        skeleton: props.skeleton,
        ...props.buttonProps,
        useLabelOnSmallScreen: false
      }
    },

    [hasDefaultActionsMenu.value]: {
      is: QasActionsMenu,
      props: {
        skeleton: props.skeleton,
        ...props.actionsMenuProps
      }
    },

    [hasDefaultFilters.value]: {
      is: QasFilters,
      props: {
        skeleton: props.skeleton,
        useSearch: false,
        useChip: false,
        useSpacing: false,
        ...props.filtersProps
      }
    }
  }

  return component.true
})

const hasActionsComponent = computed(() => {
  return hasDefaultButton.value || hasDefaultActionsMenu.value || hasDefaultFilters.value
})

const hasActionsSection = computed(() => !!slots.actions || hasActionsComponent.value)

const hasBadges = computed(() => !!props.badges.length)
const hasLabel = computed(() => !!Object.keys(props.labelProps).length)
const hasDefaultButton = computed(() => !!Object.keys(props.buttonProps).length)
const hasDefaultFilters = computed(() => !!Object.keys(props.filtersProps).length)
const hasDefaultActionsMenu = computed(() => !!Object.keys(props.actionsMenuProps).length)
const hasDescriptionSection = computed(() => !!props.description || !!slots.description)
const hasLabelSection = computed(() => hasLabel.value || slots.label || hasBadges.value)

const hasHeaderContent = computed(() => {
  return hasLabelSection.value || hasDescriptionSection.value || hasActionsSection.value
})

/**
 * Só exibo a seção de descrição com a seção de ações ao lado quando:
 * - Tenha descrição;
 * - OU não tenha seção da label E tenha componente de ações.
 */
const hasDescriptionOrOnlyActionsSection = computed(() => {
  return hasDescriptionSection.value || (!hasLabelSection.value && hasActionsComponent.value)
})
</script>
