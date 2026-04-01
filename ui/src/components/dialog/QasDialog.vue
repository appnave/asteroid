<template>
  <q-dialog ref="dialogRef" v-model="model" class="qas-dialog" :class="classes" data-cy="dialog" v-bind="dialogProps" @update:model-value="updateModelValue">
    <div class="bg-white full-width q-pa-md qas-dialog__container" :style="containerStyles">
      <header v-if="hasHeaderSlot" class="q-mb-md">
        <slot name="header" />
      </header>

      <qas-header v-else-if="props.title" v-bind="headerProps">
        <template v-if="hasTitleSlot" #label>
          <qas-label>
            <slot name="title" />
          </qas-label>
        </template>
      </qas-header>

      <section class="relative-position text-body1 text-grey-8">
        <component :is="mainComponent.is" ref="form" v-bind="mainComponent.props">
          <slot name="description">
            <div v-if="props.useHtmlDescription" data-cy="dialog-description" v-html="props.description" />

            <component :is="descriptionComponent" v-else data-cy="dialog-description">
              {{ props.description }}
            </component>
          </slot>

          <qas-actions v-if="hasActions" class="qas-dialog__actions" v-bind="defaultActionsProps" />
        </component>
      </section>
    </div>
  </q-dialog>
</template>

<script setup>
import QasLabel from '../label/QasLabel.vue'
import QasActions from '../actions/QasActions.vue'
import QasHeader from '../header/QasHeader.vue'

import { computed, ref, useAttrs, provide, useSlots, inject } from 'vue'
import { useDialogPluginComponent, QForm } from 'quasar'

defineOptions({ name: 'QasDialog' })

const props = defineProps({
  badges: {
    default: () => [],
    type: [Array, Object]
  },

  cancel: {
    default: () => ({}),
    type: [Object, Boolean]
  },

  description: {
    type: [String, Object],
    default: ''
  },

  disableCloseButton: {
    type: Boolean
  },

  ok: {
    default: () => ({}),
    type: [Object, Boolean]
  },

  size: {
    type: String,
    default: 'sm',
    validator: value => ['sm', 'md', 'lg', 'xl'].includes(value)
  },

  title: {
    type: String,
    required: true
  },

  tertiary: {
    default: () => ({}),
    type: Object
  },

  useForm: {
    type: Boolean
  },

  usePlugin: {
    type: Boolean
  },

  useAutoCloseOnCancel: {
    type: Boolean,
    default: true
  },

  useAutoCloseOnOk: {
    type: Boolean,
    default: true
  },

  useCloseButton: {
    type: Boolean,
    default: true
  },

  useHtmlDescription: {
    type: Boolean
  },

  useValidationAllAtOnce: {
    type: Boolean
  }
})

// emtis
const emit = defineEmits([
  // actions
  'cancel',
  'ok',
  'validate',

  // eventos do plugin
  ...useDialogPluginComponent.emits
])

// models
const model = defineModel({ type: Boolean })

// globals
provide('isDialog', true)
provide('btnPropsDefaults', { size: 'md' }) // define o tamanho padrão para os botões dentro do dialog

// necessário para pegar as props default do dialog quando usado no QasDrawer
const defaultProps = inject('dialogDefaultProps', null)

// composables
const slots = useSlots()
const attrs = useAttrs()
const { dialogRef, onDialogHide } = useDialogPluginComponent() // usado para o plugin

// refs
const form = ref(null)

// composables
const { defaultCancel, hasCancel } = useCancel()
const { defaultOk, hasOk, onOk } = useOk()
const { descriptionComponent, mainComponent } = useDynamicComponents()

/**
 * Necessária logica via provide para controle interno no componente QasDrawer.
 */
const hasDefaultMaxWidth = computed(() => !!defaultProps?.value.maxWidth)

// computeds
/**
 * Classes criadas para serem utilizadas quando usado com a prop "position", pois
 * o comportamento do dialog muda, e não é possível usar em conjunto com a prop
 * "useFullMaxWidth", então foi necessário uma trativa.
 */
const classes = computed(() => {
  const isRightPosition = attrs.position === 'right'
  const isLeftPosition = attrs.position === 'left'

  const sizes = {
    sm: 'qas-dialog--sm', // 450px
    md: 'qas-dialog--md', // 550px
    lg: 'qas-dialog--lg', // 800px
    xl: 'qas-dialog--xl' // 1100px
  }

  return [
    {
      [sizes[props.size]]: !hasDefaultMaxWidth.value,
      'qas-dialog--right': isRightPosition,
      'qas-dialog--left': isLeftPosition
    }
  ]
})

/**
 * Manter dessa forma até issue #1431 ser resolvida.
 */
const containerStyles = computed(() => {
  if (!hasDefaultMaxWidth.value) return

  return {
    maxWidth: defaultProps?.value?.maxWidth
  }
})

const dialogProps = computed(() => {
  const { title, ...attributes } = attrs

  return {
    ...(!props.usePlugin && { modelValue: props.modelValue }),
    ...attributes,
    persistent: defaultProps?.value?.persistent ?? hasActions.value,

    onHide: onDialogHide
  }
})

const hasActions = computed(() => hasOk.value || hasCancel.value || !!Object.keys(props.tertiary).length)

const headerProps = computed(() => {
  return {
    labelProps: {
      label: props.title
    },

    badges: props.badges,

    buttonProps: {
      ...(props.useCloseButton && {
        color: 'grey-10',
        disable: props.disableCloseButton,
        icon: 'sym_r_close',
        variant: 'tertiary',
        'data-cy': 'dialog-close-btn',
        onClick: () => updateModelValue(false)
      })
    }
  }
})

const defaultActionsProps = computed(() => {
  return {
    ...(hasOk.value && { primaryButtonProps: defaultOk.value }),
    ...(hasCancel.value && { secondaryButtonProps: defaultCancel.value }),

    tertiaryButtonProps: {
      ...props.tertiary,
      'data-cy': 'dialog-tertiary-btn'
    },

    spacingTop: 'lg',
    gutter: 'md'
  }
})

const hasHeaderSlot = computed(() => !!slots.header)
const hasTitleSlot = computed(() => !!slots.title)

// functions
function updateModelValue (value) {
  model.value = value
}

// composable definitions
function useOk () {
  // computeds
  const defaultOk = computed(() => {
    const { onClick, ...attrs } = props.ok

    return {
      label: 'Ok',
      type: (props.ok?.type || props.useForm) ? 'submit' : 'button',
      'data-cy': 'dialog-ok-btn',

      ...attrs,

      // adiciona somente se não estiver usando useForm pois o controle ficará no submit.
      ...(!props.useForm && { onClick: onOk })
    }
  })

  const hasOk = computed(() => typeof props.ok === 'boolean' ? props.ok : !!Object.keys(props.ok))

  // functions
  function onOk () {
    if (!props.useForm && props.useAutoCloseOnOk) {
      updateModelValue(false)
    }

    props.ok.onClick?.()

    emit('ok')
  }

  return {
    defaultOk,
    hasOk,
    onOk
  }
}

function useCancel () {
  // computeds
  const defaultCancel = computed(() => {
    return {
      label: 'Cancelar',
      'data-cy': 'dialog-cancel-btn',

      ...props.cancel,

      onClick: onCancel
    }
  })

  const hasCancel = computed(() => typeof props.cancel === 'boolean' ? props.cancel : !!Object.keys(props.cancel))

  // functions
  function onCancel () {
    props.cancel.onClick?.()

    if (props.useAutoCloseOnAction || props.useAutoCloseOnCancel) {
      updateModelValue(false)
    }

    emit('cancel')
  }

  return {
    defaultCancel,
    hasCancel
  }
}

function useDynamicComponents () {
  // computeds
  const mainComponent = computed(() => {
    return {
      is: props.useForm ? QForm : 'div',

      /**
       * adiciona evento de submit caso useForm seja true,
       * uma vez que somente o q-form possui este evento.
       */
      props: {
        ...(props.useForm && { onSubmit })
      }
    }
  })

  const hasRenderFunction = computed(() => {
    const description = props.description

    return typeof description === 'object' && description !== null && !Array.isArray(description)
  })

  const descriptionComponent = computed(() => hasRenderFunction.value ? props.description : 'div')

  // functions
  function submitHandler () {
    if (!props.useForm) return

    if (props.useValidationAllAtOnce) {
      let isAllComponentValid = true
      const components = form.value.getValidationComponents() || []

      for (const component of components) {
        const isValid = component?.validate?.()

        if (!isValid) {
          isAllComponentValid = false
        }
      }

      emit('validate', isAllComponentValid)

      return
    }

    emit('validate', form.value.validate())
  }

  /**
   * Sem este método, ao clicar enter com a prop useForm ativada a tela era recarregada,
   * e a ação de click do botão não era chamada pois ele não esta dentro do form.
   */
  function onSubmit (event) {
    event.preventDefault()

    if (hasOk.value) {
      onOk()
      submitHandler()
    }
  }

  return {
    mainComponent,
    descriptionComponent
  }
}
</script>

<style lang="scss">
.qas-dialog {
  $root: &;

  .q-dialog__inner > div {
    box-shadow: $shadow-2;
  }

  .q-dialog__inner--minimized {
    padding: var(--qas-spacing-md);
  }

  &--right {
    .q-dialog__inner {
      width: 100%;
      justify-content: end;
    }
  }

  &--left {
    .q-dialog__inner {
      width: 100%;
    }
  }

  // tamanhos
  &--sm {
    #{$root}__container {
      max-width: 450px !important;
    }
  }

  &--md {
    #{$root}__container {
      max-width: 550px !important;
    }
  }

  &--lg {
    #{$root}__container {
      max-width: 800px !important;
    }
  }

  &--xl {
    #{$root}__container {
      max-width: 1100px !important;
    }
  }

  // tamanho mínimo dos botões de ação (primário e secundário)
  &__actions {
    .qas-btn--primary,
    .qas-btn--secondary {
      min-width: 120px;
      width: 100%;
    }
  }
}
</style>
