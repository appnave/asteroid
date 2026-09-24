<template>
  <div class="container q-py-lg">
    <qas-alert v-bind="withBoldTextAndButton" />
  </div>
</template>

<script setup>
defineOptions({ name: 'WithBoldText' })

const withBoldTextAndButton = {
  useRegex: true,
  text: 'Exemplo com [botão 1], e destaque de **texto** para negrito.',
  buttonProps: {
    onClick: () => alert('Button clicked')
  }
}
</script>
