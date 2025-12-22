<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg text-center">
        <qas-nested-fields v-model="model" class="full-width" v-bind="nestedFieldsProps" />

        <div class="q-my-lg">
          Model: <qas-debugger :inspect="[model]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'NotHeader' })

// refs
const model = ref([])

// consts
const nestedFieldsProps = {
  field: {
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
      cities: {
        label: 'Cidades',
        name: 'cities',
        type: 'select',
        options: [
          { label: 'Cidade 1', value: 1 },
          { label: 'Cidade 2', value: 2 },
          { label: 'Cidade 3', value: 3 }
        ]
      }
    }
  },

  formCommonColumns: { col: 4 },
  useInlineActions: true,
  useHeader: false
}

</script>
