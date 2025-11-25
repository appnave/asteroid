<template>
  <div v-if="displayAlert" class="inline-block qas-alert">
    <component :is="component">
      <div class="flex items-center no-wrap">
        <div class="flex items-center no-wrap text-body1 text-grey-8">
          <q-icon v-bind="iconProps" />

          <component
            :is="textComponent"
            v-if="useRegex"
            class="q-ml-sm"
          />

          <span
            v-else
            class="q-ml-sm"
          >
            <slot>
              {{ props.text }}
            </slot>
          </span>
        </div>

        <qas-btn v-if="useCloseButton" class="q-ml-sm" color="grey-10" icon="sym_r_close" variant="tertiary" @click="close" />
      </div>
    </component>
  </div>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'

import { Status, StatusColor } from '../../enums/Status'

import { LocalStorage } from 'quasar'
import { RouterLink } from 'vue-router'
import { h, computed, inject } from 'vue'

defineOptions({ name: 'QasAlert' })

const props = defineProps({
  buttonProps: {
    type: [Object, Array],
    default: () => ({})
  },

  routerLinkProps: {
    type: [Object, Array],
    default: () => ({})
  },

  status: {
    type: String,
    default: Status.Info,
    validator: value => Object.values(Status).includes(value)
  },

  storageKey: {
    type: String,
    default: 'default'
  },

  text: {
    type: String,
    default: ''
  },

  useBox: {
    type: Boolean,
    default: undefined
  },

  useCloseButton: {
    type: Boolean
  },

  usePersistentModelOnClose: {
    type: Boolean
  },

  useRegex: {
    type: Boolean
  }
})

// models
const model = defineModel({ type: Boolean, default: true })

// globals
const isBox = inject('isBox', false)
const isDialog = inject('isDialog', false)

// composables
const { displayAlert, close } = useStorageClosed()

// computeds
const iconProps = computed(() => {
  const status = Object.keys(Status).find(key => Status[key] === props.status)

  const statusList = {
    [Status.Info]: {
      icon: 'sym_r_info'
    },

    [Status.Error]: {
      icon: 'sym_r_error'
    },

    [Status.Success]: {
      icon: 'sym_r_check_circle'
    }
  }

  return {
    color: StatusColor[status],
    name: statusList[props.status].icon,
    size: 'sm'
  }
})

/**
 * Por padrão, quando este componente estiver dentro de um QasBox ou QasDialog, ele não terá
 * shadow, terá padding e não terá margin.
 */
const component = computed(() => {
  const hasBoxProps = props.useBox !== undefined

  // Se não tiver a prop useBox, assume que está dentro de um QasBox ou QasDialog
  const useBox = hasBoxProps ? props.useBox : !isBox && !isDialog

  return useBox ? QasBox : 'div'
})

const textComponent = computed(() => {
  // Regex para encontrar caracteres que estiverem dentro de [].
  const regex = /\[.*?\]/g

  const matches = props.text.match(regex) || []

  if (!matches.length) return h('span', props.text)

  let processedText = props.text

  /**
   * Substitui cada match por um placeholder único na ordem correta
   * Exemplo: "Clique [aqui] para [ver mais]" vira "Clique $0 para $1"
   */
  matches.forEach((match, index) => {
    processedText = processedText.replace(match, `$${index}`)
  })

  // Divide o texto pelos placeholders
  const parts = processedText.split(/\$\d+/)

  const placeholders = processedText.match(/\$\d+/g) || []

  const result = []

  parts.forEach((part, index) => {
    if (part) result.push(part)

    if (index < placeholders.length) {
      // Pega o índice do placeholder para encontrar o match correto
      const placeholderIndex = parseInt(placeholders[index].replace('$', ''))

      // Pega o texto original do match. Ex: '[Clique aqui]'
      const match = matches[placeholderIndex]

      // Remove os colchetes do match. Ex: [Clique aqui] para Clique aqui
      const routerLabel = match.replaceAll(/[[\]]/g, '')

      // Determina as props do botão/link baseado no índice
      const isButtonPropsArray = Array.isArray(props.buttonProps)
      const isRouterPropsArray = Array.isArray(props.routerLinkProps)

      const buttonPropsForIndex = isButtonPropsArray
        ? props.buttonProps[placeholderIndex]
        : props.buttonProps

      const routerLinkPropsForIndex = isRouterPropsArray
        ? props.routerLinkProps[placeholderIndex]
        : props.routerLinkProps

      const hasButtonProps = buttonPropsForIndex && !!Object.keys(buttonPropsForIndex).length

      const getRouterLinkRender = () => {
        return h(
          RouterLink,
          {
            ...routerLinkPropsForIndex,
            class: 'text-primary text-subtitle1 qas-alert__link'
          },
          {
            default: () => routerLabel
          }
        )
      }

      const getQasBtnRender = () => {
        return h(
          QasBtn,
          {
            variant: 'tertiary',
            label: routerLabel,
            ...buttonPropsForIndex
          }
        )
      }

      result.push(hasButtonProps ? getQasBtnRender() : getRouterLinkRender())
    }
  })

  return h('span', result)
})

// composable definitions
function useStorageClosed () {
  // computeds
  const storageClosedKey = computed(() => `alert-${props.storageKey}-closed`)

  const displayAlert = computed(() => {
    const isClosed = props.usePersistentModelOnClose && LocalStorage.getItem(storageClosedKey.value)

    return !isClosed && model.value
  })

  // functions
  function close () {
    if (props.usePersistentModelOnClose) LocalStorage.set(storageClosedKey.value, true)

    model.value = false
  }

  return {
    displayAlert,
    close
  }
}
</script>

<style lang="scss">
.qas-alert {
  &__link {
    text-decoration: none;
  }
}
</style>
