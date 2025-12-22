<template>
  <div class="container q-py-lg">
    <qas-alert v-bind="alertProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'PageButton' })

const alertProps = {
  buttonProps: {
    onClick: () => alert('Button clicked')
  },

  text: 'Usuário incompleto, [clique aqui] para completar.',

  useRegex: true
}
</script>
