<template>
  <!-- Usando qas-single-view apenas para recuperar os dados -->
  <qas-single-view v-model:fields="viewState.fields" v-model:result="viewState.result" :custom-id :entity>
    <template #default>
      <qas-grid-generator v-bind="gridGeneratorProps" />
    </template>
  </qas-single-view>
</template>

<script setup>
import { useView } from '@bildvitta/composables'
import { computed } from 'vue'

defineOptions({ name: 'WithFieldsProps' })

const { viewState } = useView({ mode: 'single' })

const entity = 'users'

// USAR SOMENTE SE NECESSÁRIO, AQUI PEGAMOS O ID DO USUÁRIO NO NOSSO MOCK DE DADOS
const customId = '3102fad5-f14c-45d4-98e9-46ef0aa9580e'

const gridGeneratorProps = computed(() => {
  return {
    fields: viewState.value.fields,
    result: viewState.value.result,
    useBox: true,
    useInline: true,

    fieldsProps: {
      company: {
        // adiciona o tooltip e muda a tipografia somente no company
        tip: 'Tooltip do company',
        content: {
          typography: 'h4'
        }
      }
    },

    fieldset: {
      informations: {
        label: 'Informações',
        description: 'Informe algumas informações do usuário.',
        fields: ['phone', 'name'],

        subset: {
          summary: {
            fields: ['company']
          }
        }
      }
    }
  }
})
</script>
