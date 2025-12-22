<template>
  <div class="cursor-pointer items-center no-wrap q-gutter-x-sm qas-app-user row" data-cy="app-user">
    <div class="relative-position">
      <qas-avatar :image="props.user.photo" :size="props.avatarSize" :title="userName" />

      <qas-avatar v-if="hasNotificationInUserAvatar" v-bind="avatarNotificationCountProps" />
    </div>

    <div v-if="displayData" class="ellipsis qas-app-user__data">
      <div class="ellipsis qas-app-user__name text-grey-10">
        {{ userName }}
      </div>

      <div class="ellipsis qas-app-user__email text-grey-8">
        {{ props.user.email }}
      </div>
    </div>

    <q-menu class="shadow-2 text-grey-10" max-height="400px" v-bind="props.menuProps" @hide="onMenuHide">
      <div class="q-pb-sm q-pt-md q-px-md qas-app-user__menu">
        <qas-avatar class="q-mb-md" :image="props.user.photo" size="64px" :title="userName" />

        <div class="ellipsis qas-app-user__menu-name">
          {{ userName }}
        </div>

        <div class="ellipsis">
          {{ props.user.email }}
        </div>

        <qas-select v-if="hasCompaniesSelect" v-bind="defaultCompanyProps" v-model="companiesModel" class="q-my-md" data-cy="app-user-companies-select" @update:model-value="setCompanies" />

        <q-list class="q-mt-md">
          <q-item v-close-popup :active="false" class="qas-app-user__menu-item" clickable :to="props.user.to">
            <q-item-section avatar>
              <q-icon name="sym_r_person" />
            </q-item-section>

            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>

          <q-item v-if="isNotificationsEnabled" v-close-popup class="qas-app-user__menu-item" clickable @click="toggleNotificationsDrawer">
            <q-item-section avatar class="relative-position">
              <q-icon name="sym_r_notifications" />

              <qas-avatar v-if="hasUnreadNotifications" class="qas-app-user__notification-avatar--icon" v-bind="avatarNotificationCountProps" />
            </q-item-section>

            <q-item-section>
              Notificações
            </q-item-section>
          </q-item>

          <q-item v-close-popup class="qas-app-user__menu-item" clickable @click="signOut">
            <q-item-section avatar>
              <q-icon name="sym_r_logout" />
            </q-item-section>

            <q-item-section>
              Sair
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
  </div>
</template>

<script setup>
import QasAvatar from '../avatar/QasAvatar.vue'
import QasSelect from '../select/QasSelect.vue'

import useNotifications from '../../composables/use-notifications'
import useQueryCache from '../../composables/use-query-cache'
import useScreen from '../../composables/use-screen'

import { NotifySuccess, NotifyError } from '../../plugins'

import { ref, computed, watch, inject } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'QasAppUser' })

const props = defineProps({
  avatarSize: {
    default: '40px',
    type: String
  },

  companyProps: {
    default: () => ({}),
    type: Object
  },

  menuProps: {
    default: () => ({}),
    type: Object
  },

  notifications: {
    default: () => ({}),
    type: Object
  },

  user: {
    default: () => ({}),
    required: true,
    type: Object
  },

  useDataOnSmallScreen: {
    type: Boolean,
    default: true
  }
})

// emits
const emit = defineEmits(['sign-out', 'toggle-notifications'])

// globals
const axios = inject('axios')

// composables
const screen = useScreen()
const router = useRouter()

const { isNotificationsEnabled, unreadNotificationsCount } = useNotifications()

const { reset } = useQueryCache()

const { avatarNotificationCountProps } = useAvatarNotifications()

// refs
const companiesModel = ref('')
const loading = ref(false)

// consts
const IS_ME_VERSION_2 = process.env.ME_VERSION === 2

// computeds
const defaultCompanyProps = computed(() => {
  return {
    loading: loading.value,

    ...props.companyProps,

    // não é possível alterar o label.
    label: 'Vínculo'
  }
})

const hasCompaniesSelect = computed(() => !!props.companyProps.options?.length)
const hasUnreadNotifications = computed(() => unreadNotificationsCount.value > 0)
const hasNotificationInUserAvatar = computed(() => isNotificationsEnabled && hasUnreadNotifications.value)

const unreadNotificationsToString = computed(() => String(unreadNotificationsCount.value))
const userName = computed(() => props.user.name || props.user.givenName)

const displayData = computed(() => props.useDataOnSmallScreen || screen.isMedium)

// watch
watch(() => props.companyProps.modelValue, value => {
  companiesModel.value = value
}, { immediate: true })

// functions
function signOut () {
  emit('sign-out')
}

async function setCompanies (value) {
  if (!value) return

  loading.value = true

  try {
    await axios.patch('users/me', {
      [IS_ME_VERSION_2 ? 'currentMainCompany' : 'companies']: value
    })

    setTimeout(() => location.reload(), 1500)

    NotifySuccess('Vínculo alterado com sucesso.')
  } catch {
    companiesModel.value = props.companyProps.modelValue

    NotifyError('Falha ao alterar vínculo.')
  } finally {
    loading.value = false

    clearCachedFilters()
  }
}

function clearCachedFilters () {
  reset()

  router.push({ query: {} })
}

function onMenuHide () {
  if (!companiesModel.value) {
    companiesModel.value = props.companyProps.modelValue
  }
}

function toggleNotificationsDrawer () {
  emit('toggle-notifications')
}

// composables definitions
function useAvatarNotifications () {
  const hasAnimated = ref(false)

  watch(() => unreadNotificationsCount.value, () => {
    hasAnimated.value = true

    setTimeout(() => {
      hasAnimated.value = false
    }, 1000)
  })

  const avatarNotificationCountProps = computed(() => {
    const classes = [
      'qas-app-user__notification-avatar',
      'animated',
      {
        rubberBand: hasAnimated.value
      }
    ]

    return {
      class: classes,
      color: 'red-14',
      size: 'xs',
      title: unreadNotificationsToString.value,
      useCropTitle: false
    }
  })

  return {
    avatarNotificationCountProps
  }
}
</script>

<style lang="scss">
.qas-app-user {
  &__notification-avatar {
    animation-duration: 1s;
    position: absolute;
    top: 0;

    &:not(&--icon) {
      right: -4px;
    }

    &--icon {
      right: 4px;
    }
  }

  &__data {
    line-height: 1.1;
  }

  &__name,
  &__menu-name {
    font-weight: 600;
  }

  &__email {
    font-size: 0.75rem;
  }

  &__menu {
    width: 248px;
  }

  &__menu-name {
    font-size: 1.125rem;
  }

  &__menu-item {
    min-height: 36px;
    padding: 0;

    & + & {
      margin-top: var(--qas-spacing-sm);
    }
  }
}
</style>
