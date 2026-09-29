<template>
  <div class="container spaced">
    <div class="full-width">
      <div class="q-mt-lg">
        <qas-nested-fields v-model="model" v-bind="nestedProps" />

        <div class="q-my-lg">
          Model: <qas-debugger :inspect="[model]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'NestedFieldsWithHeaderProps' })

const model = ref([])

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
    cities: {
      name: 'cities',
      type: 'select',
      label: 'Cidades',
      options: [
        {
          label: 'Cidade 1',
          value: 1
        },
        {
          label: 'Cidade 2',
          value: 2
        },
        {
          label: 'Cidade 3',
          value: 3
        }
      ]
    }
  }
}

const nestedProps = {
  field,

  formColumns: {
    name: { col: 12 },
    email: { col: 12 },
    cities: { col: 12 }
  },

  rowObject: {
    name: '',
    email: '',
    cities: []
  },

  headerProps: ({ index, row }) => {
    return {
      labelProps: {
        label: `Label personalizada ${index} / nome: ${row.name}`
      },

      description: `Descrição personalizada ${index + 1}`,

      badges: [
        {
          label: 'Badge 1',
          color: 'primary',
          textColor: 'white'
        },
        {
          label: 'Badge 2',
          color: 'green-14',
          textColor: 'white'
        }
      ]
    }
  },

  useBox: true
}
</script>
