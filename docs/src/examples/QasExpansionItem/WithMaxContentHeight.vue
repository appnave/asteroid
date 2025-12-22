<template>
  <!-- Usando qas-single-view apenas para recuperar os dados -->
  <qas-single-view v-model:fields="viewState.fields" v-model:result="viewState.result" :custom-id="customId" :entity="entity">
    <qas-expansion-item :badges="badges" :fields="viewState.fields" :grid-generator-props="gridGeneratorProps" label="John Doe" max-content-height="150px" :result="viewState.result" />
  </qas-single-view>
</template>

<script setup>
import { computed } from 'vue'
import { useView } from '@bildvitta/composables'

defineOptions({ name: 'WithMaxContentHeight' })

const { viewState } = useView({ mode: 'single' })

const entity = 'users'

const badges = [
  {
    color: 'green-14',
    label: 'Aprovado',
    textColor: 'white'
  },
  {
    color: 'red-14',
    label: 'Reprovado',
    textColor: 'white'
  }
]

const gridGeneratorProps = computed(() => {
  return {
    fields: viewState.value.fields,
    result: viewState.value.result
  }
})

// USAR SOMENTE SE NECESSÁRIO, AQUI PEGAMOS O ID DO USUÁRIO NO NOSSO MOCK DE DADOS
const customId = '3102fad5-f14c-45d4-98e9-46ef0aa9580e'
</script>
