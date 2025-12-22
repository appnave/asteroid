<template>
  <div class="container spaced">
    <qas-header v-bind="headerProps" />
  </div>
</template>

<script>
export default {
  computed: {
    headerProps () {
      return {
        description: 'Algum texto de descrição.',
        labelProps: {
          label: 'Título do header'
        },
        buttonProps: {
          icon: 'sym_r_add',
          label: 'Novo usuário'
        }
      }
    }
  }
}
</script>
