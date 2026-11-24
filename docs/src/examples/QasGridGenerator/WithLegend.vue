<template>
  <!-- Usando qas-single-view apenas para recuperar os dados -->
  <qas-single-view v-model:fields="viewState.fields" v-model:result="viewState.result" :custom-id :entity>
    <template #default>
      <qas-grid-generator v-bind="gridGeneratorProps">
        <template #legend-top-informations>
          <div class="bg-red">Utilizando o slot legend-top-informations</div>
        </template>

        <template #legend-bottom-informations>
          <div class="bg-red">Utilizando o slot legend-bottom-informations</div>
        </template>
      </qas-grid-generator>

      <qas-grid-generator v-bind="gridGeneratorPropsWithSubset" class="q-mt-md">
        <template #legend-top-informations-company>
          <div class="bg-red">Utilizando o slot legend-top-informations-company</div>
        </template>

        <template #legend-bottom-informations-company>
          <div class="bg-red">Utilizando o slot legend-bottom-informations-company</div>
        </template>
      </qas-grid-generator>
    </template>
  </qas-single-view>
</template>

<script setup>
import { useView } from '@bildvitta/composables'
import { computed } from 'vue'

defineOptions({ name: 'WithLegend' })

const { viewState } = useView({ mode: 'single' })

const entity = 'users'

// USAR SOMENTE SE NECESSÁRIO, AQUI PEGAMOS O ID DO USUÁRIO NO NOSSO MOCK DE DADOS
const customId = '3102fad5-f14c-45d4-98e9-46ef0aa9580e'

const baseGeneratorProps = computed(() => {
  return {
    fields: viewState.value.fields,
    result: viewState.value.result,
    useBox: true,

    columns: {
      phone: { col: 12, sm: 6 },
      name: { col: 12, sm: 6 }
    }
  }
})

const gridGeneratorProps = computed(() => {
  return {
    ...baseGeneratorProps.value,

    fieldset: {
      informations: {
        headerProps: {
          labelProps: {
            label: 'Label do primeiro fieldset'
          },

          buttonProps: {
            label: 'Adicionar item',
            icon: 'sym_r_add'
          }
        },

        fields: ['phone', 'name']
      },

      summary: {
        headerProps: {
          description: 'Descrição do segundo fieldset',
          labelProps: {
            label: 'Label do segundo fieldset'
          }
        },
        fields: ['email'],
        useSeparator: true // É possível utilizar separador entre fieldset.
      }
    }
  }
})

const gridGeneratorPropsWithSubset = computed(() => {
  return {
    ...baseGeneratorProps.value,

    fieldset: {
      informations: {
        headerProps: {
          labelProps: {
            label: 'Label do primeiro fieldset'
          },

          buttonProps: {
            label: 'Adicionar item',
            icon: 'sym_r_add'
          }
        },

        fields: ['phone'],

        subset: {
          company: {
            label: 'Label do subset do primeiro fieldset',
            description: 'Descrição do subset do primeiro fieldset',
            fields: ['company']
          }
        }
      },

      summary: {
        headerProps: {
          description: 'Descrição do segundo fieldset',
          labelProps: {
            label: 'Label do segundo fieldset'
          }
        },

        fields: ['email'],

        useSeparator: true, // É possível utilizar separador entre fieldset.

        subset: {
          company: {
            label: 'Label do subset do segundo fieldset',
            description: 'Descrição do subset do segundo fieldset',
            fields: ['name']
          }
        }
      }
    }
  }
})
</script>
