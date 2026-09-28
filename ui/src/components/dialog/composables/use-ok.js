import { computed } from 'vue'

/**
 * @param {{
 *  props: { ok: object, useForm: boolean },
 *  emit: (event: 'ok') => void
 * }} config
 */
export default function useOk (config = {}) {
  const {
    props,
    emit
  } = config

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

  const hasOk = computed(() => {
    return typeof props.ok === 'boolean' ? props.ok : !!Object.keys(props.ok)
  })

  function onOk () {
    props.ok.onClick?.()

    emit('ok')
  }

  return {
    defaultOk,
    hasOk,

    onOk
  }
}
