<template>
  <qas-container>
    <qas-text-truncate class="q-mb-md" v-bind="textTruncateProps" />

    <qas-text-truncate v-bind="textTruncatePropsWithComponent" />
  </qas-container>
</template>

<script setup>
import CustomComponent from './CustomComponent.vue'
import { h, computed } from 'vue'

defineOptions({ name: 'AlwaysButtonAndCustomDescription' })

// consts
const textTruncateProps = {
  dialogTitle: 'Aqui está meu título!',
  useAlwaysSeeMore: true,
  text: 'Exemplo para ver detalhes sempre',

  dialogProps: {
    description: 'Esta é uma descrição personalizada para o dialog.'
  }
}

// computeds
const textTruncatePropsWithComponent = computed(() => {
  return {
    dialogTitle: 'Aqui está meu título!',
    useAlwaysSeeMore: true,
    text: 'Utilizando um componente na descrição',

    dialogProps: {
      description: h(CustomComponent)
    }
  }
})
</script>
