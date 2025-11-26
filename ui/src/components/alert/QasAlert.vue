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
  // Regex para encontrar caracteres que estiverem dentro de [] para links/botões
  const linkRegex = /\[.*?\]/g
  // Regex para encontrar caracteres que estiverem dentro de ** para bold
  const boldRegex = /\*\*(.*?)\*\*/g

  const linkMatches = props.text.match(linkRegex) || []
  const boldMatches = props.text.match(boldRegex) || []

  // Se não há matches de links/botões e nem bold, retorna texto simples
  if (!linkMatches.length && !boldMatches.length) {
    return h('span', props.text)
  }

  let processedText = props.text

  /**
   * Substitui cada match de link por um placeholder único na ordem correta
   * Exemplo: "Clique [aqui] para [ver mais]" vira "Clique $LINK_0 para $LINK_1"
   */
  linkMatches.forEach((match, index) => {
    processedText = processedText.replace(match, `$LINK_${index}`)
  })

  /**
   * Substitui cada match de bold por um placeholder único na ordem correta
   * Exemplo: "Texto **importante** aqui" vira "Texto $BOLD_0 aqui"
   */
  boldMatches.forEach((match, index) => {
    processedText = processedText.replace(match, `$BOLD_${index}`)
  })

  // Separa o texto em partes usando regex mais específica
  const parts = processedText.split(/(\$(?:LINK|BOLD)_\d+)/)

  const result = []
  parts.forEach(part => {
    // Se a parte é texto normal, adiciona como string
    if (!part.startsWith('$')) {
      if (part) result.push(part)
      return
    }

    // Se é um placeholder, processa baseado no tipo
    const placeholderMatch = part.match(/\$(LINK|BOLD)_(\d+)/)

    if (!placeholderMatch) return

    const [, type, indexStr] = placeholderMatch
    const placeholderIndex = parseInt(indexStr)

    if (type === 'LINK') {
      // Pega o texto original do match de link. Ex: '[Clique aqui]'
      const linkMatch = linkMatches[placeholderIndex]

      // Remove os colchetes do match. Ex: [Clique aqui] para Clique aqui
      const routerLabel = linkMatch.replaceAll(/[[\]]/g, '')

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
    } else if (type === 'BOLD') {
      // Pega o texto original do match de bold. Ex: '**texto importante**'
      const boldMatch = boldMatches[placeholderIndex]

      // Remove os asteriscos do match. Ex: **texto importante** para texto importante
      const boldText = boldMatch.replace(/\*\*(.*?)\*\*/, '$1')

      // Cria elemento bold
      result.push(
        h('strong', boldText)
      )
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
