<template>
  <div class="container spaced">
    <qas-expansion-item group="user" label="John Doe user">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>

    <qas-expansion-item class="q-mt-lg" group="user" label="John Doe 2 user">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>

    <q-separator class="q-my-lg" />

    <qas-expansion-item class="q-mt-lg" group="contact" label="Contact">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>

    <qas-expansion-item class="q-mt-lg" group="contact" label="Contact 2">
      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>
  </div>
</template>

<script setup>
defineOptions({ name: 'Group' })
</script>
