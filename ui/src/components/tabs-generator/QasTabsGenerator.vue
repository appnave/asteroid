<template>
  <div class="qas-tabs-generator">
    <q-tabs v-model="model" active-color="primary" align="left" :breakpoint="0" content-class="text-grey-8" dense inline-label left-icon="sym_r_chevron_left" outside-arrows right-icon="sym_r_chevron_right">
      <slot v-for="(tab, key) in formattedTabs" :item="tab" :name="`tab-${tab.value}`">
        <component :is="tabComponent" :key="key" v-bind="getTabProps(tab)" class="text-body1" :name="tab.value" no-caps :ripple="false">
          <slot :item="tab" :name="`tab-after-${tab.value}`">
            <q-icon v-if="tab.icon" :name="tab.icon" size="sm" />

            <qas-status v-if="tab.status" :color="tab.status" />

            <div class="q-ml-xs">
              {{ getFormattedLabel(tab) }}
            </div>
          </slot>
        </component>
      </slot>
    </q-tabs>
  </div>
</template>

<script setup>
import QasStatus from '../status/QasStatus.vue'

import { decimal } from '../../helpers'

import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { extend, QRouteTab, QTab } from 'quasar'

defineOptions({ name: 'QasTabsGenerator' })

const props = defineProps({
  counters: {
    default: () => ({}),
    type: Object
  },

  modelValue: {
    default: '',
    type: [String, Number]
  },

  tabs: {
    default: () => ({}),
    required: true,
    type: [Object, Array]
  },

  querySlug: {
    default: '',
    type: String
  },

  useRouteTab: {
    type: Boolean
  }
})

// emits
const emit = defineEmits(['update:modelValue'])

// composables
const route = useRoute()
const router = useRouter()

// computed
const model = computed({
  get () {
    return props.modelValue
  },

  set (value) {
    const currentTab = Array.isArray(props.tabs)
      ? props.tabs.find(tab => tab?.value === value)
      : formattedTabs.value[value]

    if (currentTab?.disabled) return

    emit('update:modelValue', value)
  }
})

const formattedTabs = computed(() => {
  const tabs = extend(true, {}, props.tabs)

  for (const key in tabs) {
    if (typeof tabs[key] === 'string') {
      tabs[key] = { label: tabs[key], value: key }
    }
  }

  return tabs
})

const tabComponent = computed(() => props.useRouteTab ? QRouteTab : QTab)

// watch
watch(() => route.query[props.querySlug], onQuerySlugChange, { immediate: true })
watch(() => model.value, onTabsChange, { immediate: true })

// functions
function getFormattedLabel ({ label, counter, value }) {
  const normalizedCount = props.counters[value] || counter

  if (!normalizedCount) return label

  const countString = String(decimal(normalizedCount))

  return `${label} (${countString.padStart(2, '0')})`
}

function getTabProps (tab) {
  const { icon, label, ...payload } = tab

  return payload
}

function onTabsChange (value) {
  if (!props.querySlug) return

  const { ...query } = route.query

  if (!value && props.querySlug) {
    delete query[props.querySlug]

    router.push({ query })

    return
  }

  router.push({ query: { ...query, [props.querySlug]: value } })
}

function onQuerySlugChange (value) {
  if (value && value !== model.value) {
    model.value = value
  }
}
</script>

<style lang="scss">
.qas-tabs-generator {
  .q-tabs {
    &--scrollable {
      .q-tab {
        &:first-child {
          padding-left: var(--qas-spacing-xs);
        }

        &:last-child {
          padding-right: var(--qas-spacing-xs);
        }
      }
    }

    .q-tab {
      &--inactive {
        opacity: 1;
      }

      &__content {
        position: relative;

        &::before {
          background: var(--q-primary);
          bottom: 0;
          content: '';
          height: 2px;
          left: 0;
          position: absolute;
          right: 0;
          transform: scale(0);
          transition: transform var(--qas-generic-transition);
        }
      }

      &--active {
        font-weight: 600;

        .q-tab__content {
          position: relative;

          &::before {
            transform: scale(100%);
          }
        }
      }

      &:not(.q-tabs--scrollable .q-tab):first-child {
        padding-left: 0;
      }

      &:not(.q-tabs--scrollable .q-tab):last-child {
        padding-right: 0;
      }

      &:not(&--active) {
        transition: color var(--qas-generic-transition);

        &:not([disabled]):hover {
          color: var(--q-primary-contrast) !important;
        }
      }

      &__icon {
        font-size: 24px;
      }

      &__arrow--faded {
        color: $grey-6;
        opacity: 1 !important;
      }

      &__indicator {
        display: none;
      }
    }

    &__arrow:not(&--faded) {
      color: $grey-10;
      transition: color var(--qas-generic-transition);

      &:hover {
        color: var(--q-primary-contrast);
      }
    }
  }

  .q-focus-helper {
    display: none;
  }
}
</style>
