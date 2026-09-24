<template>
  <div class="container spaced text-center">
    <qas-btn @click="$qas.dialog(dialogConfig)">Usando plugin com injeção</qas-btn>
  </div>
</template>

<script>
import DescriptionComponent from './DescriptionComponent'

export default {
  computed: {
    dialogConfig () {
      return {
        description: DescriptionComponent
      }
    }
  }
}
</script>
