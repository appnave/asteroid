<template>
  <div class="container spaced">
    <qas-header class="q-mb-md" v-bind="headerProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'HeaderWithTip' })

const headerProps = {
  labelProps: { label: 'Título do header' },
  description: 'Algum texto de exemplo para ficar ao lado do botão de adicionar.',
  tipProps: { text: 'Dica adicional sobre o header.' }
}
</script>
