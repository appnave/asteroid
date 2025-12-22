<template>
  <error-component v-bind="errorProps" />
</template>

<script>
import ErrorComponent from './ErrorComponent.vue'
import bigShoesHereSVG from '../assets/big-shoes-hero.svg'

export default {
  name: 'NotFound',

  components: {
    ErrorComponent
  },

  computed: {
    errorProps () {
      return {
        code: '404',
        description: 'A página que você está tentando acessar está indisponível ou não existe.',
        imagePath: bigShoesHereSVG,
        buttonProps: {
          to: { path: '/' },
          label: 'Voltar ao início'
        }
      }
    }
  }
}
</script>
