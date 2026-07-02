import { computed } from 'vue'

/**
 * @param {{
 *  color: string,
 *  props: { deleteIcon: string, deleteLabel: string, deleteProps: object },
 *  qas: { delete: function(object) }
 * }}
 */
export default function useDelete ({ color, props, qas }) {
  const hasDelete = computed(() => !!Object.keys(props.deleteProps).length)

  const deleteBtnProps = computed(() => {
    return {
      ...(hasDelete.value && {
        delete: {
          label: props.deleteLabel,

          ...props.deleteProps.buttonProps,

          handler: () => qas.delete(props.deleteProps),
          color,
          icon: props.deleteIcon
        }
      })
    }
  })

  return {
    deleteBtnProps,
    hasDelete
  }
}
