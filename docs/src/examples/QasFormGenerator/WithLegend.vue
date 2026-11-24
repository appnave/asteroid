<template>
  <div class="container spaced">
    <qas-form-generator v-model="model" v-bind="formGeneratorProps">
      <template #legend-top-informations-others>
        <div class="bg-orange">
          Acessando o slot abaixo do conteúdo do header de um subset
        </div>
      </template>

      <template #legend-top-informations>
        <div class="bg-red">
          Acessando o slot slot abaixo do conteúdo do header de um fieldset
        </div>
      </template>

      <template #legend-bottom-informations>
        <div class="bg-red">
          Acessando o slot do footer de um fieldset
        </div>
      </template>

      <template #legend-bottom-informations-others>
        <div class="bg-orange">
          Acessando o slot do footer de um subset
        </div>
      </template>
    </qas-form-generator>

    <div class="q-mt-lg">
      model: <qas-debugger :inspect="[model]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithLegend' })

// refs
const model = ref({})

// consts
const formGeneratorProps = {
  commonColumns: { col: 12, sm: 4 },
  columns: { others: { col: 8 }, comment: { col: 12 } },
  fields: {
    uuid: {
      name: 'uuid',
      type: 'hidden'
    },

    company: {
      name: 'company',
      label: 'Empresa',
      multiple: true,
      type: 'select',
      options: [
        { label: 'Empresa com nome grande 1', value: 'company-1' },
        { label: 'Empresa com nome grande 2', value: 'company-2' },
        { label: 'Empresa com nome grande 3', value: 'company-3' },
        { label: 'Empresa com nome grande 4', value: 'company-4' }
      ]
    },

    name: {
      name: 'name',
      label: 'Nome',
      type: 'string'
    },

    phone: {
      name: 'phone',
      label: 'Telefone',
      type: 'text'
    },

    email: {
      name: 'email',
      label: 'Email',
      type: 'email'
    },

    others: {
      name: 'others',
      label: 'Outros',
      type: 'text'
    },

    comment: {
      name: 'comment',
      label: 'Digite um comentário aqui',
      type: 'textarea'
    }
  },

  fieldset: {
    informations: {
      label: 'Informações',
      description: 'Informe algumas informações do usuário.',
      fields: ['phone', 'name', 'company'],

      subset: {
        others: {
          headerProps: {
            labelProps: { label: 'Uma subseção' }
          },
          fields: ['email', 'others']
        }
      }
    }
  },
  useBox: true
}
</script>
