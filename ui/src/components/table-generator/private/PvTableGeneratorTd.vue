<template>
  <component :is="component.is" v-bind="component.props" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

defineOptions({ name: 'PvTableGeneratorProps' })

const QasActionsMenu = defineAsyncComponent(() => import('../../actions-menu/QasActionsMenu.vue'))
const QasBadge = defineAsyncComponent(() => import('../../badge/QasBadge.vue'))
const QasBtn = defineAsyncComponent(() => import('../../btn/QasBtn.vue'))
const QasCopy = defineAsyncComponent(() => import('../../copy/QasCopy.vue'))
const QasStatus = defineAsyncComponent(() => import('../../status/QasStatus.vue'))
const QasTextTruncate = defineAsyncComponent(() => import('../../text-truncate/QasTextTruncate.vue'))
const QasToggleVisibility = defineAsyncComponent(() => import('../../toggle-visibility/QasToggleVisibility.vue'))

const props = defineProps({
  componentData: {
    type: Object,
    default: () => ({})
  },

  label: {
    type: String,
    default: ''
  },

  row: {
    type: Object,
    default: () => ({})
  },

  name: {
    type: String,
    default: ''
  }
})

const component = computed(() => {
  const defaultValue = props.row?.[props.name]

  const componentPaths = {
    QasActionsMenu: {
      component: QasActionsMenu,
      props: {}
    },

    QasBadge: {
      component: QasBadge,
      props: {
        label: defaultValue
      }
    },

    QasBtn: {
      component: QasBtn,
      props: {
        label: defaultValue
      }
    },

    QasCopy: {
      component: QasCopy,
      props: {
        text: defaultValue
      }
    },

    QasStatus: {
      component: QasStatus,
      props: {}
    },

    QasTextTruncate: {
      component: QasTextTruncate,
      props: {
        dialogTitle: props.label,
        maxWidth: 260,

        // caso personalize o componente passando "list", não pode enviar "text" senão vai ter erro de tipo
        text: 'list' in (props.componentData.props || {}) ? '' : defaultValue
      }
    },

    QasToggleVisibility: {
      component: QasToggleVisibility,
      props: {
        text: defaultValue
      }
    }
  }

  // Os componentes abaixo precisam adicionar o stopPropagation e preventDefault no click para nao chamar o rowClick ou rowRouteFn
  const hasPreventEvent = ['QasActionsMenu', 'QasBtn'].includes(props.componentData.component)

  const componentPath = componentPaths[props.componentData.component]

  return {
    is: componentPath.component,
    props: {
      ...componentPath.props,
      ...props.componentData.props,

      ...(hasPreventEvent && {
        onClick: event => {
          event.stopPropagation()
          event.preventDefault()

          props.componentData.props?.onClick?.(event)
        }
      })
    }
  }
})
</script>
