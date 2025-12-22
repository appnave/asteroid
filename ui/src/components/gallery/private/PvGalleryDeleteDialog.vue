<template>
  <qas-dialog v-bind="defaultDialogProps" />
</template>

<script setup>
import QasDialog from '../../dialog/QasDialog.vue'

import { promiseHandler } from '../../../helpers'
import useDelete, { baseProps } from '../composables/use-delete'

import { inject } from 'vue'

defineOptions({ name: 'PvGalleryDeleteDialog' })

const props = defineProps({
  ...baseProps,

  payload: {
    type: Array,
    default: () => []
  },

  modelKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['success', 'error', 'cancel'])

const qas = inject('qas')

const { defaultDialogProps, id } = useDelete({ props, emit, destroyFn: destroy })

async function destroy () {
  const { data, error } = await promiseHandler(
    qas.getAction({
      entity: props.entity,
      key: 'update',
      payload: {
        id: id.value,
        url: props.url,
        payload: { [props.modelKey]: props.payload }
      }
    }),
    {
      errorMessage: 'Ops! Não foi possível deletar o item.',
      successMessage: 'Item deletado com sucesso!'
    }
  )

  if (data) return emit('success', data)

  if (error) emit('error', error)
}
</script>
