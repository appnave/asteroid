<template>
  <div>
    <q-toolbar class="justify-between q-mb-md q-px-none qas-page-header">
      <div class="ellipsis">
        <q-toolbar-title v-if="props.title" class="text-h3">
          {{ props.title }}
        </q-toolbar-title>

        <q-breadcrumbs v-if="hasBreadcrumbs" class="text-caption" gutter="xs" separator-color="grey-8">
          <q-breadcrumbs-el v-if="props.useHomeIcon" class="qas-page-header__breadcrumbs-el text-grey-8" icon="sym_r_home" :to="homeRoute" />

          <q-breadcrumbs-el v-for="(item, index) in normalizedBreadcrumbs" :key="index" class="ellipsis inline-block qas-page-header__breadcrumbs-el" :label="item.label" :to="item.route" />
        </q-breadcrumbs>
      </div>

      <slot />
    </q-toolbar>

    <div>
      <slot name="bottom">
        <qas-header v-if="hasHeader" v-bind="props.headerProps" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import QasHeader from '../header/QasHeader.vue'

import { useOverlayNavigation } from '../../composables'

import castArray from 'lodash-es/castArray'
import { computed } from 'vue'
import { useMeta } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({ name: 'QasPageHeader' })

const props = defineProps({
  breadcrumbs: {
    default: '',
    type: [Array, String]
  },

  headerProps: {
    default: () => ({}),
    type: Object
  },

  root: {
    default: '',
    type: [Object, String]
  },

  title: {
    default: '',
    type: String
  },

  useBreadcrumbs: {
    default: true,
    type: Boolean
  },

  useHomeIcon: {
    default: true,
    type: Boolean
  }
})

// composables
const { isOverlay } = useOverlayNavigation()
const router = useRouter()

// meta tag
useMeta(() => ({ title: props.title }))

// computed
const hasBreadcrumbs = computed(() => props.useBreadcrumbs && !isOverlay)
const transformedBreadcrumbs = computed(() => {
  const list = [...castArray(props.breadcrumbs || props.title)]

  props.root && list.unshift(props.root)

  return list.map(item => {
    if (item && typeof item === 'string') {
      return { label: item }
    }

    if (!item.route && item.routeName) {
      item.route = { name: item.routeName }
    }

    return item
  })
})

const normalizedBreadcrumbs = computed(() => {
  const breadcrumbsSize = transformedBreadcrumbs.value.length

  if (breadcrumbsSize < 5) return transformedBreadcrumbs.value

  const [first, second] = transformedBreadcrumbs.value
  const last = transformedBreadcrumbs.value.at(-1)

  const beforeLast = {
    ...transformedBreadcrumbs.value.at(-2),
    label: '...'
  }

  return [
    first,
    second,
    beforeLast,
    last
  ]
})

const hasHeader = computed(() => !!Object.keys(props.headerProps).length)

const homeRoute = computed(() => router.hasRoute('Root') ? { name: 'Root' } : '/')
</script>

<style lang="scss">
.qas-page-header {
  &__breadcrumbs-el {
    max-width: 180px;
    transition: color var(--qas-generic-transition);

    &.q-breadcrumbs__el:not(.q-router-link--exact-active):hover {
      color: var(--qas-primary-contrast) !important;
    }

    .q-breadcrumbs__el-icon {
      font-size: 16px;
    }
  }

  // aplica cor "grey-8" a todos os .q-breadcrumbs__el que não uma classe .q-breadcrumbs--last como pai
  .q-breadcrumbs__el:not(.q-breadcrumbs--last .q-breadcrumbs__el) {
    color: $grey-8;
  }

  .q-breadcrumbs--last {
    color: var(--q-primary);
  }
}
</style>
