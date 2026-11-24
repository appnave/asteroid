<template>
  <q-form class="container spaced">
    <qas-uploader v-model="model" v-bind="uploaderProps" />

    <qas-debugger :inspect="[model]" />
  </q-form>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'ExUploaderMultipleEditable' })

// refs
const model = ref([
  {
    url: 'https://placehold.co/600x400/orange/white?text=img1',
    name: 'img1',
    format: 'image/png'
  },
  {
    url: 'https://placehold.co/600x400/red/white?text=img2',
    name: 'img2',
    format: 'image/png'
  },
  {
    url: 'https://placehold.co/600x400/blue/white?text=img3',
    name: 'img3',
    format: 'image/png'
  },
  {
    url: 'https://placehold.co/600x400/black/white?text=img4',
    name: 'img4',
    format: 'image/png'
  }
])

// consts
const uploaderProps = {
  addButtonLabel: 'Adicionar imagem',
  entity: 'serviceOrders',
  label: 'Meu uploader',
  multiple: true,
  fieldName: 'documents',
  useObjectModel: true,

  fields: {
    format: {
      error: true,
      name: 'format',
      label: 'Formato',
      type: 'text'
    }
  },

  errors: {
    'documents.0.format': ['Mensagem de erro.'],
    'documents.0.url': ['Mensagem de erro.'],
    'documents.3.format': ['Mensagem de erro.']
  }
}
</script>
