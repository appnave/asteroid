<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div v-for="item in 10" :key="item" class="col-4">
        <qas-gallery-card v-bind="props" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    props () {
      return {
        name: 'Meu titulo',

        url: 'https://picsum.photos/200/300.jpg',

        disable: true,

        actionsMenuProps: {
          list: {
            edit: {
              label: 'Editar',
              icon: 'sym_r_edit',
              handler: () => alert('Clicado no editar.')
            },

            remove: {
              label: 'Remover',
              icon: 'sym_r_delete',
              handler: () => alert('Clicado no remover.')
            }
          }
        },

        gridGeneratorProps: {
          fields: {
            email: {
              name: 'email',
              type: 'email',
              label: 'E-mail'
            }
          },

          result: {
            email: 'email@exemplo.com'
          }
        }
      }
    }
  }
}
</script>
