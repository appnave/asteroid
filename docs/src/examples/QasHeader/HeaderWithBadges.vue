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
        },

        badges: [
          {
            label: 'Badge 1'
          },
          {
            label: 'Badge 2',
            color: 'red-14',
            textColor: 'white'
          },
          {
            label: 'Badge 3',
            color: 'primary',
            textColor: 'white'
          }
        ]
      }
    }
  }
}
</script>
