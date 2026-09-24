import { computed } from 'vue'

/**
 * @param {{
 *  props: { cancel: object },
 *  emit: (event: 'cancel') => void
 * }} config
 */
export default function useCancel (config = {}) {
  const {
    props,
    emit
  } = config

  const defaultCancel = computed(() => {
    return {
      label: 'Cancelar',
      'data-cy': 'dialog-cancel-btn',

      ...props.cancel,

      onClick: onCancel
    }
  })

  const hasCancel = computed(() => {
    return typeof props.cancel === 'boolean' ? props.cancel : !!Object.keys(props.cancel)
  })

  function onCancel () {
    props.cancel.onClick?.()

    emit('cancel')
  }

  return {
    defaultCancel,
    hasCancel
  }
}
