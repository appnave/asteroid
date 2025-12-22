<template>
  <div class="container q-py-lg">
    <qas-actions v-bind="actionsProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithTertiary' })

const actionsProps = {
  primaryButtonProps: {
    label: 'Primário',
    onClick: () => alert('Botão primário clicado')
  },

  secondaryButtonProps: {
    label: 'Secundário',
    onClick: () => alert('Botão secundário clicado')
  },

  tertiaryButtonProps: {
    label: 'Terciário',
    onClick: () => alert('Botão terciário clicado')
  }
}
</script>
