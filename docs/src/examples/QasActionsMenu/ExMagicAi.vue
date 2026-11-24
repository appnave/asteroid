<template>
  <div class="container q-py-lg">
    <qas-actions-menu :list />
  </div>
</template>

<script setup>
defineOptions({ name: 'ExMagicAi' })

const list = {
  magicAi: {
    icon: 'sym_r_wand_stars',
    label: 'Gerar texto',
    handler: () => alert('handler ativado'),
    useMagicAiColor: true
  },
  edit: {
    icon: 'sym_r_create',
    label: 'Editar',
    handler: () => alert('handler ativado')
  },
  visibility: {
    icon: 'sym_r_visibility',
    label: 'Visualizar',
    handler: () => alert('handler ativado')
  }
}
</script>
