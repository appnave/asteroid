<template>
  <div class="qas-app-menu">
    <q-drawer :key="reRenderCount" v-model="model" :behavior="behavior" class="shadow-2" :mini="isMiniMode" :mini-width="88" show-if-above :width="drawerWidth">
      <div class="column full-height justify-between no-wrap">
        <!-- logo + select de módulos -->
        <div class="full-width q-pb-lg" @mouseenter="onMouseEvent" @mouseleave="onMouseEvent">
          <!-- Brand -->
          <div v-if="!screen.untilLarge" class="q-mb-lg q-pt-lg qas-app-menu__label" :class="classes.spacedItem">
            <router-link class="column flex items-center justify-center relative-position text-no-decoration" :to="rootRoute">
              <q-img v-if="normalizedBrand" :alt="props.title" class="qas-app-menu__brand qas-app-menu__label" fit="contain" height="27px" img-class="qas-app-menu__brand-img" no-spinner :src="normalizedBrand" />

              <span v-else-if="!isMiniMode" class="ellipsis text-bold text-primary text-subtitle2">{{ props.title }}</span>

              <q-badge v-if="hasDevelopmentBadge" class="q-mt-sm" color="red" :label="developmentBadgeLabel" />
            </router-link>
          </div>

          <div v-if="normalizedBrand" class="qas-app-menu__label" :class="classes.spacedItem">
            <q-separator />
          </div>

          <div v-if="screen.untilLarge" class="flex itens-center justify-between q-pt-md q-px-xl text-right">
            <div>
              <q-img v-if="normalizedBrand" :alt="props.title" class="qas-app-menu__brand qas-app-menu__label" fit="contain" height="27px" img-class="qas-app-menu__brand-img" no-spinner :src="props.miniBrand" />
            </div>

            <qas-btn color="grey-10" icon="sym_r_close" variant="tertiary" @click="closeDrawer" />
          </div>

          <!-- Module -->
          <div v-if="showAppMenuDropdown" class="items-center justify-between no-wrap q-mt-lg qas-app-menu__label qas-app-menu__module row" :class="classes.spacedItem">
            <div class="full-width text-center">
              <pv-app-menu-dropdown v-bind="appMenuDropdownProps" />
            </div>
          </div>
        </div>

        <!-- lista do menu -->
        <q-list v-if="normalizedItems.length" ref="list" class="qas-app-menu__menu text-grey-10" @mouseleave="onMouseEvent" @mousemove="onMouseMoveList">
          <template v-for="(menuItem, index) in normalizedItems">
            <div v-if="hasChildren(menuItem)" :key="`children-${index}`" class="qas-app-menu__content" :class="classes.content">
              <q-item class="ellipsis items-center q-py-none qas-app-menu__item qas-app-menu__item--label-mini text-weight-bold">
                <div class="ellipsis qas-app-menu__label text-grey-10 text-subtitle2" :class="classes.spacedItem">
                  {{ menuItem.label }}
                </div>
              </q-item>

              <q-item v-for="(menuChildItem, childIndex) in menuItem.children" :key="childIndex" :active="isActive(menuChildItem)" class="qas-app-menu__children qas-app-menu__item qas-app-menu__item--children" :to="getRouterRedirect(menuChildItem)">
                <q-item-section v-if="menuChildItem.icon" avatar>
                  <q-icon :name="menuChildItem.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <div class="ellipsis text-subtitle2">
                      {{ menuChildItem.label }}
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <div v-if="hasSeparator(index)" class="qas-app-menu__label" :class="classes.spacedItem">
                <q-separator spaced />
              </div>
            </div>

            <!-- quando tem children vazio, não deve mostrar label do item, e a label do item
              não tem "to", então validar se tem "to" para mostrar o item -->
            <q-item v-else-if="menuItem.to" :key="index" :active="isActive(menuItem)" active-class="q-router-link--active" class="qas-app-menu__item" :to="getRouterRedirect(menuItem)">
              <q-item-section v-if="menuItem.icon" avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <div class="ellipsis text-subtitle2">
                    {{ menuItem.label }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>

        <!-- usuário + chat ajuda -->
        <div v-if="showAppUser" class="column justify-end no-wrap qas-app-menu__user-chat" @mouseenter="onMouseEvent" @mouseleave="onMouseEvent">
          <!-- Chat Ajuda -->
          <q-list v-if="useChat" class="q-mt-md">
            <q-item class="q-pb-none qas-app-menu__chat-item" clickable @click="toggleChat">
              <q-item-section avatar class="qas-app-menu__chat-item-section text-primary">
                <q-icon name="sym_r_chat" />
              </q-item-section>

              <q-item-section class="qas-app-menu__chat-item-section text-primary">
                <q-item-label>
                  <div class="ellipsis text-subtitle2">
                    Solicitar ajuda
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- User -->
          <div class="full-width q-mt-md q-pb-lg q-px-lg">
            <qas-app-user v-bind="defaultAppUserProps" />
          </div>
        </div>
      </div>
    </q-drawer>
  </div>
</template>

<script setup>
import PvAppMenuDropdown from './private/PvAppMenuDropdown.vue'
import QasAppUser from '../app-user/QasAppUser.vue'
import QasBtn from '../btn/QasBtn.vue'

import useAppMenuDropdown from './composables/use-app-menu-dropdown'
import useAppUser from './composables/use-app-user'
import useDevelopmentBadge from './composables/use-development-badge'
import { useScreen } from '../../composables'
import { useAuthUser } from '../../composables/private'

import { handleProcess, setScrollGradient } from '../../helpers'

import Gleap from 'gleap'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'QasAppMenu',
  inheritAttrs: false
})

const props = defineProps({
  appUserProps: {
    type: Object,
    required: true,
    default: () => ({})
  },

  brand: {
    default: '',
    required: true,
    type: String
  },

  homeRoute: {
    type: [String, Object],
    default: undefined
  },

  items: {
    default: () => [],
    type: Array
  },

  miniBrand: {
    type: String,
    required: true,
    default: ''
  },

  modelValue: {
    default: true,
    type: Boolean
  },

  modules: {
    default: () => [],
    type: Array
  },

  notifications: {
    default: () => ({}),
    type: Object
  },

  title: {
    default: '',
    type: String
  },

  useChat: {
    type: Boolean
  },

  useHomeItem: {
    type: Boolean,
    default: true
  }
})

// emits
const emit = defineEmits(['sign-out', 'update:modelValue', 'toggle-notifications'])

// composables
const screen = useScreen()
const router = useRouter()

const { toggleChat } = useChatMenu()

// refs
const hasOpenedMenu = ref(false)
const hasOpenedHelpChat = ref(false)
const isMini = ref(screen.isLarge)
const reRenderCount = ref(0)
const list = ref(null)

// consts
const rootRoute = router.hasRoute('Root') ? { name: 'Root' } : { path: '/' }

const composableParams = {
  props,
  onMenuUpdate: setHasOpenedMenu,
  onSignOut: () => emit('sign-out'),
  onToggleNotifications: () => emit('toggle-notifications')
}

// composables
const { defaultAppUserProps, showAppUser } = useAppUser(composableParams)
const { appMenuDropdownProps, showAppMenuDropdown } = useAppMenuDropdown(composableParams)
const { developmentBadgeLabel, hasDevelopmentBadge } = useDevelopmentBadge()

const { initializeScrollGradient } = setScrollGradient()

// computeds
const model = computed({
  get () {
    return props.modelValue
  },

  set (value) {
    emit('update:modelValue', value)
  }
})

const normalizedItems = computed(() => {
  if (props.useHomeItem) {
    return [
      {
        label: 'Início',
        icon: 'sym_r_home',
        to: props.homeRoute || rootRoute
      },
      ...props.items
    ]
  }

  return props.items
})

const behavior = computed(() => screen.untilLarge ? 'mobile' : 'desktop')
const drawerWidth = computed(() => screen.untilLarge ? 320 : 280)
const normalizedBrand = computed(() => isMini.value ? props.miniBrand : props.brand)

const isMiniMode = computed(() => {
  return screen.isLarge && isMini.value && !hasOpenedMenu.value && !hasOpenedHelpChat.value
})

const classes = computed(() => {
  return {
    content: {
      'qas-app-menu__content--spaced': !isMiniMode.value
    },

    spacedItem: {
      'qas-app-menu__label--spaced': !isMiniMode.value
    }
  }
})

/**
 * @desc Recurso tecnológico temporário (ou definitivo), este bug ocorre por conta
 * da atualização do vue para a versão `v3.4+`, onde tiveram mudanças referentes a
 * reatividade, existem issues abertas no Quasar, porém sem expectativas
 * de que um dia será resolvido por parte deles.
 *
 * @see {@link https://github.com/quasarframework/quasar/issues/16651}
 */
watch(() => behavior.value, value => {
  /**
   * @desc quando o comportamento passa a ser desktop novamente é porque aconteceu um
   * resize na pagina, então é necessário renderizar o componente QDrawer novamente.
   */
  if (value === 'desktop') {
    reRenderCount.value += 1
  }
})

// hooks
onMounted(() => initializeScrollGradient(list.value.$el))
onBeforeUnmount(() => initializeScrollGradient(list.value.$el))

// functions
function closeDrawer () {
  emit('update:modelValue', false)
}

function getNormalizedPath (path) {
  return path.split('/').filter(Boolean)?.[0]
}

function getPathFromObject ({ path, name }) {
  if (path) return getNormalizedPath(path)

  const resolvedRoute = router.resolve({ name })

  return getNormalizedPath(resolvedRoute.path)
}

function getRouterRedirect ({ to }) {
  return to || ''
}

function hasChildren ({ children }) {
  return !!(children || []).length
}

function hasSeparator (index) {
  return !!normalizedItems.value[index + 1]
}

function isActive ({ to }) {
  // quando o children vem vazio, "to" é "undefined", então precisa ser feito esta trativa.
  if (!to) return false

  const currentPath = getNormalizedPath(router.currentRoute.value.path)
  const itemPath = typeof to === 'string' ? getNormalizedPath(to) : getPathFromObject(to)

  return currentPath === itemPath
}

function onMouseEvent (event) {
  if (!screen.isLarge) return

  // Se o mouse estiver fora do QList
  const isMouseLeave = event.type === 'mouseleave'

  isMini.value = isMouseLeave

  model.value = false
}

function onMouseMoveList (event) {
  // Se o menu já estiver aberto ou não for tela grande, não deve alterar o estado do menu.
  if (!screen.isLarge || !isMini.value) return

  const listElement = list.value.$el

  // Obter a posição do QList na viewport
  const { left, width } = listElement.getBoundingClientRect()

  // Obter a posição do mouse relativa ao QList
  const mouseRelativeX = event.clientX - left

  // Calcular a largura do scrollbar do QList
  const scrollbarWidth = listElement.offsetWidth - listElement.clientWidth

  // Se o mouse estiver na faixa do scrollbar (última parte do QList)
  const isOverScrollbar = mouseRelativeX > width - scrollbarWidth

  // Se o mouse estiver sobre o scrollbar, não deve alterar o estado do menu
  if (isOverScrollbar) return

  onMouseEvent(event)
}

function setHasOpenedMenu (value) {
  hasOpenedMenu.value = value
}

// composables definitions
function useChatMenu () {
  // composables
  const { user, hasUser } = useAuthUser()

  // consts
  const isMeVersionTwo = process.env.ME_VERSION === 2

  // hooks
  onMounted(initializeChat)

  // functions
  function initializeChat () {
    const gleapEnv = handleProcess(() => process.env.GLEAP)

    if (!props.useChat || !gleapEnv || !hasUser.value) return

    Gleap.initialize(gleapEnv)
    Gleap.setLanguage('pt-BR')

    const {
      uuid,
      name,
      email,
      callingCode,
      phone,
      companyLink,
      companyLinksOptions,
      mainCompanyOptions, // somente na v2
      currentMainCompany // somente na v2
    } = user.value

    const companyId = isMeVersionTwo ? currentMainCompany : companyLink
    const companyNameList = isMeVersionTwo ? mainCompanyOptions : companyLinksOptions
    const companyName = companyNameList?.find(({ value }) => value === companyId)?.label

    Gleap.identify(uuid, {
      name,
      email,
      phone: `${callingCode || '55'}${phone}`,
      companyId,
      companyName
    })
  }

  function toggleChat () {
    Gleap.isOpened() ? Gleap.close() : Gleap.open()
  }

  return {
    initializeChat,
    toggleChat
  }
}
</script>

<style lang="scss" scoped>
.qas-app-menu {
  // Workaround para alterar o padding interno do QSelect sem influenciar na caixa de opções.
  &__module {
    .q-field__native {
      padding-left: var(--qas-spacing-md);
    }

    .q-field__append {
      margin-right: var(--qas-spacing-sm);
    }
  }

  &__select {
    border-radius: var(--qas-generic-border-radius);
  }

  &__item {
    &:not(&--label) + &:not(&--label) {
      margin-top: var(--qas-spacing-xs);
    }

    &--children.q-item {
      & + & {
        margin-top: var(--qas-spacing-xs);
      }
    }
  }

  &__label {
    padding-left: var(--qas-spacing-md) !important;
    padding-right: var(--qas-spacing-md) !important;
    transition: padding 120ms; // 120ms é o mesmo tempo utilizado na abertura do QDrawer.
    will-change: auto;

    &--spaced {
      padding-left: var(--qas-spacing-xl) !important;
      padding-right: var(--qas-spacing-xl) !important;
    }
  }

  &__brand {
    :deep(.qas-app-menu__brand-img) {
      transition: opacity 120ms ease-in; // 120ms é o mesmo tempo utilizado na abertura do QDrawer.
    }
  }

  &__item--label-mini {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  // Faz com que essa área ocupe todo o tamanho restante até o QList, adicionando o evento de mouseover.
  &__user-chat {
    flex: 1 1 auto;
  }

  &__chat-item:hover &__chat-item-section {
    color: var(--qas-primary-contrast) !important;
  }

  &__chat-item-section {
    transition: color var(--qas-generic-transition);
  }

  .q-item:not(&__item--label-mini) {
    padding-left: var(--qas-spacing-xl) !important;
    padding-right: var(--qas-spacing-xl) !important;
  }

  &__content + &__content,
  &__content + &__item,
  &__item + &__content {
    margin-top: var(--qas-spacing-xs);
  }

  // User
  .qas-app-user__data {
    line-height: 1.25;
  }

  // Media: untilLarge
  @media (min-width: $breakpoint-sm-max) {
    &__menu {
      overflow-x: hidden;
    }
  }
}
</style>
