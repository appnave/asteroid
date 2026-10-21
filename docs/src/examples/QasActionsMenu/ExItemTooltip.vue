<template>
  <div class="container q-py-lg">
    <qas-actions-menu v-bind="props" />

    <qas-actions-menu v-bind="props2" />
  </div>
</template>

<script setup>
const list = {
  visibility: {
    icon: 'sym_r_visibility',
    label: 'Visualizar',
    tooltip: 'Abre os detalhes do item.',
    handler: () => alert('handler ativado')
  },

  edit: {
    icon: 'sym_r_create',
    label: 'Editar',
    disable: true,
    tooltip: 'Edita o item.',
    disabledTooltip: 'Você não tem permissão para editar.',
    handler: () => alert('handler ativado')
  },

  person: {
    icon: 'sym_r_person',
    label: 'Perfil',
    tooltip: 'Acessa o perfil do responsável.',
    handler: () => alert('handler ativado')
  }
}

const props = {
  list
}

const props2 = {
  list,
  splitName: 'visibility'
}
</script>
