<template>
  <q-layout view="hHh Lpr lff">
    <slot v-if="$qas.screen.untilLarge" name="app-bar">
      <qas-app-bar v-bind="appBarProps" @sign-out="signOut" @toggle-menu="toggleMenuDrawer" @toggle-notifications="toggleNotificationsDrawer" />
    </slot>

    <slot name="app-menu">
      <qas-app-menu :model-value="showMenuDrawer" v-bind="defaultAppMenuProps" @sign-out="signOut" @toggle-notifications="toggleNotificationsDrawer" @update:model-value="updateMenuDrawer" />
    </slot>

    <slot>
      <q-page-container>
        <q-page>
          <router-view :route="overlayBackgroundRoute" />
        </q-page>
      </q-page-container>
    </slot>

    <pv-layout-overlay-drawer />

    <q-ajax-bar color="primary" position="bottom" size="2px" />

    <pv-layout-notifications-drawer v-if="isNotificationsEnabled" v-model="notificationsDrawer" />
  </q-layout>
</template>

<script setup>
import PvLayoutNotificationsDrawer from './private/PvLayoutNotificationsDrawer.vue'
import QasAppBar from '../app-bar/QasAppBar.vue'
import QasAppMenu from '../app-menu/QasAppMenu.vue'
import PvLayoutOverlayDrawer from './private/PvLayoutOverlayDrawer.vue'

import useScreen from '../../composables/use-screen'
import useNotifications from '../../composables/use-notifications'

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'QasLayout' })

const props = defineProps({
  appBarProps: {
    default: () => ({}),
    type: Object
  },

  appMenuProps: {
    default: () => ({}),
    type: Object
  },

  initialUnreadNotificationsCount: {
    type: Number,
    default: 0
  },

  modelValue: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits(['sign-out', 'update:modelValue'])

// expondo método "toggleNotificationsDrawer" para fora do componente.
defineExpose({ toggleNotificationsDrawer })

const screen = useScreen()

const { isNotificationsEnabled, setUnreadNotificationsCount } = useNotifications()

const route = useRoute()

const menuDrawer = ref(false)
const notificationsDrawer = ref(false)

// computed

/**
 * Sempre fornece uma rota para o <router-view>. Quando o overlay está ativo,
 * usa a rota resolvida do background; sem overlay, usa a rota atual.
 * Isso evita alternância entre `undefined` e objeto de rota, reduzindo remounts.
 */
const overlayBackgroundRoute = computed(() => {
  return route.query?.overlay === 'true'
    ? route.meta.overlayBackgroundResolvedRoute
    : route
})

const defaultAppMenuProps = computed(() => {
  return {
    ...props.appBarProps,
    ...props.appMenuProps
  }
})

const showMenuDrawer = computed(() => !screen.untilLarge || menuDrawer.value)

watch(() => props.initialUnreadNotificationsCount, setUnreadNotificationsCount, { immediate: true })

// functions
function signOut () {
  emit('sign-out')
}

function toggleMenuDrawer () {
  updateMenuDrawer(!menuDrawer.value)
}

function updateMenuDrawer (value) {
  menuDrawer.value = value

  emit('update:modelValue', value)
}

function toggleNotificationsDrawer () {
  notificationsDrawer.value = !notificationsDrawer.value
}
</script>
