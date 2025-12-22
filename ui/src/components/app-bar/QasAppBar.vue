<template>
  <q-header class="qas-app-bar shadow-2" height-hint="56">
    <q-toolbar class="bg-white qas-app-bar__toolbar text-grey-10">
      <qas-btn color="grey-10" icon="sym_r_menu" variant="tertiary" @click="toggleMenuDrawer" />

      <q-toolbar-title>
        <router-link class="flex items-center no-wrap text-no-decoration" :class="routerLinkClass" :to="rootRoute">
          <img v-if="props.brand" :alt="props.title" class="qas-app-bar__brand" :src="props.brand">

          <span v-else class="ellipsis text-bold text-primary">{{ props.title }}</span>

          <q-badge v-if="hasDevelopmentBadge" class="q-ml-sm" color="red" :label="developmentBadgeLabel" />
        </router-link>
      </q-toolbar-title>

      <slot v-if="hasUser" name="user">
        <qas-app-user v-bind="defaultAppUserProps" />
      </slot>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import QasAppUser from '../app-user/QasAppUser.vue'
import QasBtn from '../btn/QasBtn.vue'

import { useScreen } from '../../composables'

import { computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'QasAppBar' })

const props = defineProps({
  appUserProps: {
    type: Object,
    required: true,
    default: () => ({})
  },

  brand: {
    default: '',
    type: String
  },

  notifications: {
    default: () => ({}),
    type: Object
  },

  title: {
    required: true,
    type: String
  }
})

const emit = defineEmits(['sign-out', 'toggle-menu', 'toggle-notifications'])

const router = useRouter()
const screen = useScreen()

const defaultAppUserProps = computed(() => {
  return {
    menuProps: {
      anchor: 'bottom end',
      offset: [0, 5],
      self: 'top end'
    },

    useDataOnSmallScreen: false,

    onSignOut: signOut,
    onToggleNotifications: toggleNotifications,
    ...props.appUserProps
  }
})

const rootRoute = router.hasRoute('Root') ? { name: 'Root' } : { path: '/' }

const developmentBadgeLabel = computed(() => {
  const hosts = {
    localhost: 'Local',
    '.dev.': 'Develop'
  }

  if (process.env.DEV) return hosts.localhost

  const current = Object.keys(hosts).find(host => location.hostname.includes(host))

  return current ? hosts[current] : ''
})

const hasDevelopmentBadge = computed(() => !!developmentBadgeLabel.value)
const hasUser = computed(() => !!Object.keys(defaultAppUserProps.value.user || {}).length)

const routerLinkClass = computed(() => screen.isSmall && 'justify-center')

function signOut () {
  emit('sign-out')
}

function toggleNotifications () {
  emit('toggle-notifications')
}

function toggleMenuDrawer () {
  emit('toggle-menu')
}
</script>

<style lang="scss">
.qas-app-bar {
  &__toolbar {
    height: 56px;
  }

  &__brand {
    max-width: 115px;
  }
}
</style>
