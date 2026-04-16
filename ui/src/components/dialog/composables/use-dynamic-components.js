import { computed } from 'vue'
import { QForm } from 'quasar'

/**
 * @param {{
 *  props: { card: object, useForm: boolean, useValidationAllAtOnce: boolean },
 *  form: import('vue').Ref<HTMLInputElement | null>,
 *  hasOk: import('vue').ComputedRef<boolean>,
 *  emit: (event: 'validate', payload: Promise<boolean> | boolean) => void,
 *  onOk: Function
 * }} config
 */
export default function useDynamicComponents (config = {}) {
  const {
    props,
    form,
    hasOk,

    onOk = () => {},
    emit
  } = config

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

  // métodos
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
