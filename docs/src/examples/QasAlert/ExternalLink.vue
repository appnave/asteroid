<template>
  <div class="container q-py-lg">
    <qas-alert v-bind="alertProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'ExternalLink' })

const alertProps = {
  text: '[Clique aqui] para ir para o google.',

  buttonProps: {
    href: 'http://google.com',
    target: '_blank'
  },

  useRegex: true
}
</script>
