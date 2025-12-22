<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div class="col-4">
        <qas-card :route="{ name: 'Root' }" title="Titulo">
          <template #default>
            <div>
              Meu conteúdo
            </div>
          </template>
        </qas-card>
      </div>

      <div class="col-4">
        <qas-card :expansion-props="expansionProps" :route="{ name: 'Root' }" title="Titulo">
          <template #default>
            <div>
              Meu conteúdo
            </div>
          </template>
        </qas-card>
      </div>

      <div class="col-4">
        <qas-card
          :actions-menu-props="actionsMenuProps" :expansion-props="expansionProps"
          :route="{ name: 'Root' }" status-color="red-14" title="Titulo" use-expansion
        >
          <template #default>
            <div>
              Meu conteúdo
            </div>
          </template>
        </qas-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    actionsMenuProps () {
      return {
        list: {
          show: {
            label: 'Ir para detalhes',
            icon: 'sym_r_visibility'
          },

          edit: {
            label: 'Editar',
            icon: 'sym_r_edit'
          }
        }
      }
    },

    expansionProps () {
      return {
        label: 'Ver mais',
        content: 'Conteúdo do menu expansivo'
      }
    }
  }
}
</script>
