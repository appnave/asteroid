<template>
  <div class="container q-gutter-y-md q-py-lg">
    <qas-alert v-bind="alertProps" />

    <qas-alert v-bind="alertProps" status="warning" />

    <qas-alert v-bind="alertProps" status="error" />

    <qas-alert v-bind="alertProps" status="success" />
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
