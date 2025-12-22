<template>
  <error-component v-bind="errorProps" />
</template>

<script>
import ErrorComponent from './ErrorComponent.vue'
import bigShoesWalkingDogSVG from '../assets/big-shoes-walking-the-dog.svg'

export default {
  name: 'Forbidden',

  components: {
    ErrorComponent
  },

  computed: {
    errorProps () {
      return {
        code: '403',
        description: 'Parece que você não tem permissão para acessar esta página. \n Sugerimos que entre em contato com o administrador.',
        imagePath: bigShoesWalkingDogSVG,
        buttonProps: {
          to: { path: '/' },
          label: 'Voltar ao início'
        }
      }
    }
  }
}
</script>
