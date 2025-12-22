<template>
  <qas-btn v-bind="attributes" @click.stop.prevent="onDelete">
    <template v-for="(_, name) in slots" #[name]="context">
      <slot :name="name" v-bind="context || {}" />
    </template>
  </qas-btn>
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'

import { inject, computed, useSlots } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'QasDelete',
  inheritAttrs: false
})

const props = defineProps({
  buttonProps: {
    default: () => ({}),
    type: Object
  },

  customId: {
    default: '',
    type: [Number, String]
  },

  dialogProps: {
    default: () => ({}),
    type: Object
  },

  entity: {
    required: true,
    type: String
  },

  url: {
    default: '',
    type: String
  },

  deleting: {
    type: Boolean
  },

  useAutoDeleteRoute: {
    default: true,
    type: Boolean
  },

  redirectRoute: {
    type: [Object, String],
    default: ''
  }
})

// emits
const emit = defineEmits(['success', 'error', 'update:deleting'])

// composables
const slots = useSlots()
const route = useRoute()

// global
const qas = inject('qas')

// computeds
const id = computed(() => props.customId || route.params.id)

const attributes = computed(() => {
  return {
    // Propriedades padrão do botão de delete
    color: 'grey-10',
    label: 'Excluir',
    icon: 'sym_r_delete',
    ...props.buttonProps
  }
})

// functions
function onDelete () {
  qas.delete({
    deleteActionParams: {
      entity: props.entity,
      id: id.value,
      url: props.url
    },

    dialogProps: props.dialogProps,

    useAutoDeleteRoute: props.useAutoDeleteRoute,

    redirectRoute: props.redirectRoute,

    // callbacks
    onDelete: isDeleting => emit('update:deleting', isDeleting),

    onDeleteError: error => emit('error', error),

    onDeleteSuccess: response => emit('success', response)
  })
}
</script>
