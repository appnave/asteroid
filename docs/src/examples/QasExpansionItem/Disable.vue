<template>
  <div class="container spaced">
    <qas-expansion-item disable-button label="John Doe">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>

    <qas-expansion-item class="q-mt-lg" disable label="John Doe">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>

    <qas-expansion-item class="q-mt-lg" label="John Doe">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>
  </div>
</template>

<script setup>
defineOptions({ name: 'Disable' })
</script>
