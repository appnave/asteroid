import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const baseProps = {
  customId: {
    default: '',
    type: [Number, String]
  },

  dialogProps: {
    default: () => ({}),
    type: Object
  },

  entity: {
    default: '',
    type: String
  },

  url: {
    default: '',
    type: String
  }
}

export default function useDelete ({ props, destroyFn, emit }) {
  const route = useRoute()

  const defaultDialogProps = computed(() => {
    return {
      title: 'Excluir',
      description: 'Tem certeza que deseja excluir este item?',

      ok: {
        label: 'Excluir',
        onClick: destroyFn
      },

      cancel: {
        onClick: () => emit('cancel')
      },

      ...props.dialogProps
    }
  })

  const id = computed(() => props.customId || route.params.id)

  return {
    defaultDialogProps,
    id
  }
}
