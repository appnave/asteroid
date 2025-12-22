<template>
  <div class="container q-py-lg">
    <qas-box>
      <qas-label label="Dentro do label" />

      <qas-alert v-bind="alertProps" />
    </qas-box>
  </div>
</template>

<script setup>
defineOptions({ name: 'InsideBox' })

const alertProps = {
  buttonProps: {
    onClick: () => alert('Button clicked')
  },

  text: 'Usuário incompleto, [clique aqui] para completar.',

  useRegex: true
}
</script>
