<template>
  <div class="container q-py-lg">
    <qas-input label="Meu input readonly" :model-value readonly use-copy />
  </div>
</template>

<script setup>
defineOptions({ name: 'Readonly' })

const modelValue = 'Valor do input readonly'
</script>
