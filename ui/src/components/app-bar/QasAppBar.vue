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

      <q-toggle
        v-if="showDarkModeToggle"
        aria-label="Alternar tema"
        checked-icon="sym_r_dark_mode"
        class="qas-app-bar__dark-toggle"
        :model-value="darkMode.isDark.value"
        unchecked-icon="sym_r_light_mode"
        @update:model-value="setDarkMode"
      />

      <slot v-if="hasUser" name="user">
        <qas-app-user v-bind="defaultAppUserProps" />
      </slot>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import QasAppUser from '../app-user/QasAppUser.vue'
import QasBtn from '../btn/QasBtn.vue'

import { useDarkMode as useDarkModeComposable, useScreen } from '../../composables'

import asteroidConfig from 'asteroid-config'

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
  },

  useDarkMode: {
    default: undefined,
    type: Boolean
  }
})

const emit = defineEmits(['sign-out', 'toggle-menu', 'toggle-notifications'])

const router = useRouter()
const screen = useScreen()
const darkMode = useDarkModeComposable()

const showDarkModeToggle = computed(() => {
  if (props.useDarkMode !== undefined) return props.useDarkMode

  return asteroidConfig.framework.featureToggle?.useDarkMode ?? false
})

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

function setDarkMode (value) {
  darkMode.setTheme(value ? 'dark' : 'light')
}

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

  &__dark-toggle {
    &.q-toggle {
      margin-right: 4px;

      .q-toggle__inner {
        color: $amber-6;
        font-size: 32px;
        height: 1em;
        min-width: 1.8em;
        padding: 0;
        transition: color 220ms ease;
        width: 1.8em;
      }

      .q-toggle__track {
        background: linear-gradient(135deg, #fff4c2 0%, #ffd66e 100%);
        border-radius: 999px;
        box-shadow: inset 0 0 0 1px rgba($amber-7, .22);
        height: 100%;
        opacity: 1;
        overflow: hidden;
        transition: box-shadow 220ms ease;
      }

      .q-toggle__thumb {
        height: .75em;
        left: .125em;
        top: .125em;
        transition: left 220ms cubic-bezier(.4, 0, .2, 1), transform 220ms ease;
        width: .75em;

        &::after {
          background-color: #fffdf7;
          box-shadow: 0 4px 12px rgb(217 148 31 / 22%);
          transition: background-color 220ms ease, box-shadow 220ms ease;
        }

        .q-icon {
          color: $amber-8;
          font-size: .42em;
          opacity: 1;
          transition: color 220ms ease, transform 220ms ease;
        }
      }

      .q-toggle__inner--truthy {
        color: $blue-grey-7;

        .q-toggle__track {
          background: linear-gradient(135deg, #58627f 0%, #1c2231 100%);
          box-shadow: inset 0 0 0 1px rgb(255 255 255 / 6%), 0 6px 16px rgb(15 23 42 / 16%);
        }

        .q-toggle__thumb {
          left: .925em;

          &::after {
            background-color: #f8fafc;
            box-shadow: 0 6px 16px rgb(15 23 42 / 28%);
          }

          .q-icon {
            color: $blue-grey-9;
            transform: rotate(-12deg);
          }
        }
      }
    }
  }
}

.body--dark {
  .qas-app-bar {
    &__dark-toggle {
      &.q-toggle {
        .q-toggle__inner {
          color: $blue-grey-6;
        }

        .q-toggle__inner--truthy {
          color: $blue-grey-5;

          .q-toggle__track {
            background: linear-gradient(135deg, #657090 0%, #252c3e 100%);
            box-shadow: inset 0 0 0 1px rgb(255 255 255 / 8%), 0 10px 22px rgb(0 0 0 / 30%);
          }

          .q-toggle__thumb {
            &::after {
              background-color: #f5f7fb;
              box-shadow: 0 8px 18px rgb(0 0 0 / 34%);
            }

            .q-icon {
              color: $blue-grey-10;
            }
          }
        }
      }
    }
  }
}
</style>
