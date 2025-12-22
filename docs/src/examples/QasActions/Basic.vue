<template>
  <div class="container q-py-lg">
    <qas-actions v-bind="actionsProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const actionsProps = {
  primaryButtonProps: {
    label: 'Botão primário',
    onClick: () => alert('Botão primário clicado')
  },

  secondaryButtonProps: {
    label: 'Botão secundário',
    onClick: () => alert('Botão secundário clicado')
  }
}
</script>
