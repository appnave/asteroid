<template>
  <div class="container spaced">
    <div class="q-mt-lg">
      <qas-nested-fields v-model="model" :button-destroy-props="getButtonDestroyProps" class="full-width" :field :use-starts-empty="false" />

      <div class="q-my-lg">
        Model: <qas-debugger :inspect="[model]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'ButtonDestroyPropsFunction' })

// refs
const model = ref([])

// consts
const field = {
  name: 'nested',
  type: 'nested',
  label: 'Meu nested',
  children: {
    name: {
      name: 'name',
      type: 'text',
      label: 'Nome'
    },
    email: {
      name: 'email',
      type: 'email',
      label: 'E-mail'
    },
    validated: {
      name: 'validated',
      type: 'radio',
      label: 'Está validado',
      options: [
        {
          label: 'Sim',
          value: true
        },
        {
          label: 'Não',
          value: false
        }
      ]
    }
  }
}

// functions
function getButtonDestroyProps ({ row }) {
  return {
    color: 'grey-10',
    icon: 'sym_r_delete',
    label: 'Excluir',
    disable: row.validated,
    variant: 'tertiary'
  }
}
</script>
