<template>
  <div class="container spaced">
    <qas-uploader v-model="model" v-bind="uploaderProps" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'WithHeaderProps' })

const model = ref(['https://placehold.co/600x400/orange/white?text=img1'])

const uploaderProps = {
  entity: 'serviceOrders',

  addButtonLabel: 'Botão de adicionar',

  headerProps: {
    labelProps: {
      label: 'Label personalizado'
    },

    description: 'Descrição personalizada',

    badges: [
      {
        label: 'Badge 1',
        color: 'primary',
        textColor: 'white'
      }
    ],

    actionsMenuProps: {
      list: {
        share: {
          icon: 'sym_r_share',
          label: 'Botão de compartilhar'
        }
      }
    }
  }
}
</script>
