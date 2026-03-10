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

        <qas-btn v-if="useCloseButton" class="q-ml-sm" :color="closeBtnColor" icon="sym_r_close" variant="tertiary" @click="close" />
      </div>
    </component>
  </div>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'

import { Status, StatusColor } from '../../enums/Status'
import { useThemeColor } from '../../composables'

import { LocalStorage } from 'quasar'
import { RouterLink } from 'vue-router'
import { h, computed, inject } from 'vue'

defineOptions({ name: 'QasAlert' })

const closeBtnColor = useThemeColor('grey-10')

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
  // Configuração dos tokens suportados
  const tokens = [
    {
      type: 'LINK',
      regex: /\[(.*?)\]/g,
      extractContent: match => match.replace(/\[(.*?)\]/, '$1'),
      render: (content, index) => {
        const isButtonPropsArray = Array.isArray(props.buttonProps)
        const isRouterPropsArray = Array.isArray(props.routerLinkProps)

        const buttonPropsForIndex = isButtonPropsArray
          ? props.buttonProps[index]
          : props.buttonProps

        const routerLinkPropsForIndex = isRouterPropsArray
          ? props.routerLinkProps[index]
          : props.routerLinkProps

        const hasButtonProps = buttonPropsForIndex && !!Object.keys(buttonPropsForIndex).length

        if (hasButtonProps) {
          return h(QasBtn, {
            variant: 'tertiary',
            label: content,
            ...buttonPropsForIndex
          })
        }

        return h(RouterLink, {
          ...routerLinkPropsForIndex,
          class: 'text-primary text-subtitle1 qas-alert__link'
        }, {
          default: () => content
        })
      }
    },
    {
      type: 'BOLD',
      regex: /\*\*(.*?)\*\*/g,
      extractContent: match => match.replace(/\*\*(.*?)\*\*/, '$1'),
      render: content => h('strong', { class: 'text-weight-bold' }, content)
    }
  ]

  // Encontra todos os matches de todos os tipos de token
  const allMatches = []

  tokens.forEach(token => {
    const matches = props.text.match(token.regex) || []

    matches.forEach(match => {
      allMatches.push({
        type: token.type,
        match,
        content: token.extractContent(match),
        render: token.render
      })
    })
  })

  // Se não há matches, retorna texto simples
  if (!allMatches.length) {
    return h('span', props.text)
  }

  let processedText = props.text

  // Substitui cada match por um placeholder único
  allMatches.forEach((matchData, index) => {
    processedText = processedText.replace(matchData.match, `$${matchData.type}_${index}`)
  })

  // Separa o texto em partes
  const parts = processedText.split(/(\$\w+_\d+)/)
  const result = []

  parts.forEach(part => {
    // Se a parte é texto normal, adiciona como string
    if (!part.startsWith('$')) {
      if (part) result.push(part)
      return
    }

    // Se é um placeholder, encontra o match correspondente
    const placeholderMatch = part.match(/\$(\w+)_(\d+)/)
    if (!placeholderMatch) return

    const [, type, indexStr] = placeholderMatch
    const index = parseInt(indexStr)

    // Encontra o match data correspondente
    const matchData = allMatches[index]
    if (!matchData || matchData.type !== type) return

    // Conta quantos matches do mesmo tipo vieram antes (para o índice das props)
    const typeIndex = allMatches
      .slice(0, index)
      .filter(m => m.type === type)
      .length

    // Renderiza o componente
    result.push(matchData.render(matchData.content, typeIndex))
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
